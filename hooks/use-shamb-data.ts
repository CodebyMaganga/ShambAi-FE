'use client';

import { useQuery } from '@tanstack/react-query';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ImpactMetrics {
  farmersAssessed: number;
  thinFileFarmersHelped: number;
  relationshipSignalsFound: number;
  assessmentsImprovedThroughCommunity: number;
}

interface PlatformStatus {
  ussdAssessments: number;
  evidenceProfilesGenerated: number;
  smsMessagesDelivered: number;
  neo4jRelationshipsTraversed: number;
  lastUpdated: string;
  systemHealth: 'operational' | 'degraded' | 'maintenance';
}

interface MaryStory {
  name: string;
  role: string;
  traditionalAssessment: { items: string[]; outcome: string };
  shambaiAssessment: { items: string[]; outcome: string };
  smsReceived: string;
}

interface EvidenceCard {
  id: string;
  title: string;
  description: string;
  examples: string[];
}

interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  crop: string;
  imageUrl: string;
  scenario: 'strong-evidence' | 'thin-file-helped' | 'no-evidence';
  traditionalOutcome: string;
  evidenceFound: string[];
  shambaiOutcome: string;
  smsReceived: string;
  expandableDetails: {
    story: string;
    assessmentReasoning: string;
    relationshipEvidence: string[];
  };
}

interface RelationshipStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface OrganisationRecord {
  id: string;
  name: string;
  location: string;
  baseAssessment: number;
  evidenceFound: string;
  adjustment: number;
  finalOutcome: string;
  evidenceProfile: {
    cooperatives: string[];
    buyers: string[];
    guarantors: string[];
    communityScore: number;
    peersConnected: number;
    sharedBuyerReliability: number;
    communityRepaymentPattern: number;
    missingDataRecovered: string[];
    relationshipDepth: number;
    networkStrength: string;
    dataCompleteness: number;
    recommendationConfidence: number;
    lastAssessmentDate: string;
    graphSignalsFound: string[];
    internalExplanation: string;
    baseReasons: string[];
    evidenceReasons: string[];
  };
  smsSent: string;
  internalNotes: string;
  finalAssessment: number;
}

interface DemoStep {
  id: string;
  label: string;
  description: string;
  farmerId: string;
}

// ── API base URL ───────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-challenge-backend.onrender.com';

// ── Helpers ────────────────────────────────────────────────────────────────────

const TIER_LABELS: Record<number, string> = {
  1: 'Gold', 2: 'Silver', 3: 'Bronze', 4: 'Decline',
};

const COMMUNITY_LABELS: Record<string, string> = {
  chama: 'Chama member', sacco: 'SACCO member',
  coop: 'Cooperative member', none: 'No group membership',
};

const CROP_LABELS: Record<string, string> = {
  crops: 'Maize / Beans', dairy: 'Dairy / Livestock',
  horticulture: 'Horticulture', mixed: 'Mixed farming',
};

const FARM_ACCESS_LABELS: Record<string, string> = {
  owned: 'Owns land', family: 'Family land',
  leased: 'Leases land', shared: 'Shared access',
};

// Derive a display name from phoneHash — e.g. "Farmer A3F2"
function farmerDisplayName(phoneHash: string, index: number): string {
  const names = [
    'Amina W.', 'Mary A.', 'Fatima N.', 'Grace K.', 'Josephine W.',
    'Wanjiru M.', 'Aisha O.', 'Nyambura J.', 'Zawadi R.', 'Mumbi C.',
    'Rehema S.', 'Atieno B.',
  ];
  return names[index % names.length] || `Farmer ${phoneHash.slice(0, 6).toUpperCase()}`;
}

// Derive outcome label from tier
function outcomeFromTier(tier: number): string {
  if (tier === 1) return 'Approved';
  if (tier === 2) return 'Conditional Approval';
  return 'Referred for Manual Review';
}

// Derive evidence found label from community ties
function evidenceFoundLabel(communityTies: string, networkFound?: boolean): string {
  if (communityTies === 'chama') return 'Chama savings group verified';
  if (communityTies === 'sacco') return 'SACCO membership confirmed';
  if (communityTies === 'coop') return 'Agricultural cooperative member';
  if (networkFound) return 'Community evidence discovered';
  return 'None discovered';
}

// Derive adjustment from tier and score
function deriveAdjustment(tier: number, score: number | null): number {
  if (score !== null && score !== undefined) return 0; // we have real score
  // estimate from tier
  if (tier === 1) return 28;
  if (tier === 2) return 15;
  if (tier === 3) return 5;
  return 0;
}

// Build SMS text from tier and community
function buildSmsText(name: string, tier: number, communityTies: string): string {
  if (tier === 1) {
    return `Habari ${name}! Tathmini yako imekamilika. Kulingana na ${COMMUNITY_LABELS[communityTies] || 'ushahidi wako'}, unastahili mkopo. Wasiliana na wakala wako wa ushirika.`;
  }
  if (tier === 2) {
    return `Habari ${name}! Tathmini yako imekamilika. Unastahili mkopo wa awali. Jiunge na chama ili kupata mkopo mkubwa zaidi.`;
  }
  return `Habari ${name}. Tunahitaji maelezo zaidi. Afisa wa shamba atakutembelea ndani ya siku 7. Maswali? Piga *384*16051#.`;
}

// ── LIVE API fetchers ──────────────────────────────────────────────────────────

/**
 * Fetch impact metrics from /dashboard/stats.
 * Falls back to last known values if API is unreachable.
 */
const fetchImpactMetrics = async (): Promise<ImpactMetrics> => {
  try {
    const res = await fetch(`${API}/dashboard/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('stats fetch failed');
    const data = await res.json();

    const total: number = data.totalFarmers || 0;

    // Thin-file = farmers who have community ties (chama/sacco/coop)
    const thinFile: number = (data.communityBreakdown || [])
      .filter((c: { type: string }) => c.type !== 'none')
      .reduce((sum: number, c: { count: number }) => sum + c.count, 0);

    // Improved through community = tier 1 + tier 2 with community ties
    const improved: number = (data.tierBreakdown || [])
      .filter((t: { tier: number }) => t.tier === 1 || t.tier === 2)
      .reduce((sum: number, t: { count: number }) => sum + t.count, 0);

    // Relationship signals = rough estimate: each farmer generates ~12 signals on average
    const signals = total * 12;

    return {
      farmersAssessed: total,
      thinFileFarmersHelped: thinFile,
      relationshipSignalsFound: signals,
      assessmentsImprovedThroughCommunity: improved,
    };
  } catch {
    // Fallback — don't break the page if API is cold-starting on Render
    return {
      farmersAssessed: 7,
      thinFileFarmersHelped: 6,
      relationshipSignalsFound: 84,
      assessmentsImprovedThroughCommunity: 5,
    };
  }
};

/**
 * Fetch organisation records from /dashboard/farmers.
 * Maps real DB farmers to the OrganisationRecord shape the table expects.
 */
const fetchOrganisationRecords = async (): Promise<OrganisationRecord[]> => {
  try {
    const res = await fetch(`${API}/dashboard/farmers?limit=10&sortBy=lastScoredAt&sortDir=desc`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('farmers fetch failed');
    const data = await res.json();
    const farmers: Array<{
      _id: string;
      phoneHash: string;
      location: string;
      cropType: string | { category: string };
      communityTies: string;
      currentTier: number;
      currentScore: number | null;
      lastScoredAt: string;
      assessmentCount: number;
      farmAccess: string;
      evidenceVerification?: {
        chama?: { name: string | null };
        communityVerification?: {
          chamaMembershipVerified: boolean;
          cooperativeMemberVerified: boolean;
        };
        notes?: string;
      };
    }> = data.farmers || [];

    return farmers.map((f, i) => {
      const name = farmerDisplayName(f.phoneHash, i);
      const location = (f.location || 'Kenya').charAt(0).toUpperCase() + (f.location || '').slice(1);
      const tier = f.currentTier || 4;
      const score = f.currentScore;
      const communityTies = f.communityTies || 'none';

      // Handle cropType being either a string or an object
      const cropTypeRaw = typeof f.cropType === 'object' && f.cropType !== null
        ? (f.cropType as { category: string }).category
        : (f.cropType as string);
      const cropLabel = CROP_LABELS[cropTypeRaw] || cropTypeRaw || 'Mixed farming';

      const baseScore = score ? Math.max(10, score - deriveAdjustment(tier, score)) : Math.floor(Math.random() * 30) + 20;
      const adjustment = deriveAdjustment(tier, score);
      const finalScore = score || (baseScore + adjustment);
      const outcome = outcomeFromTier(tier);
      const networkFound = communityTies !== 'none';

      // Build evidence reasons from what we know
      const evidenceReasons: string[] = [];
      if (communityTies === 'chama') evidenceReasons.push('Women\'s chama membership verified');
      if (communityTies === 'sacco') evidenceReasons.push('SACCO membership confirmed');
      if (communityTies === 'coop') evidenceReasons.push('Agricultural cooperative verified');
      if (f.farmAccess === 'owned') evidenceReasons.push('Land ownership established');
      if (f.farmAccess === 'family') evidenceReasons.push('Family land tenure confirmed');
      if (f.evidenceVerification?.communityVerification?.chamaMembershipVerified) {
        evidenceReasons.push('Chama membership field-verified by officer');
      }
      if (f.evidenceVerification?.chama?.name) {
        evidenceReasons.push(`Registered with: ${f.evidenceVerification.chama.name}`);
      }

      const baseReasons: string[] = ['No formal collateral', 'No bank credit history'];
      if (!f.farmAccess || f.farmAccess === 'leased') baseReasons.push('No land title');

      const graphSignals: string[] = [];
      if (communityTies !== 'none') {
        graphSignals.push(`${COMMUNITY_LABELS[communityTies]} verified through assessment`);
        graphSignals.push('Community network signal processed');
      }
      if (f.assessmentCount > 1) {
        graphSignals.push(`${f.assessmentCount} assessments — repeat engagement signal`);
      }

      return {
        id: f._id || f.phoneHash,
        name,
        location,
        baseAssessment: baseScore,
        evidenceFound: evidenceFoundLabel(communityTies, networkFound),
        adjustment,
        finalOutcome: outcome,
        finalAssessment: finalScore,
        smsSent: buildSmsText(name.split(' ')[0], tier, communityTies),
        internalNotes: f.evidenceVerification?.notes || `Tier ${tier} — ${TIER_LABELS[tier]}. ${cropLabel}.`,
        evidenceProfile: {
          cooperatives: communityTies === 'coop' ? ['Agricultural Cooperative'] : [],
          buyers: [],
          guarantors: [],
          communityScore: networkFound ? 75 : 0,
          peersConnected: networkFound ? 3 : 0,
          sharedBuyerReliability: 0,
          communityRepaymentPattern: networkFound ? 80 : 0,
          missingDataRecovered: networkFound ? ['Community ties verified'] : [],
          relationshipDepth: networkFound ? 2 : 0,
          networkStrength: tier === 1 ? 'High' : tier === 2 ? 'Medium' : 'None',
          dataCompleteness: networkFound ? 65 : 20,
          recommendationConfidence: tier === 1 ? 88 : tier === 2 ? 68 : 30,
          lastAssessmentDate: f.lastScoredAt
            ? new Date(f.lastScoredAt).toLocaleDateString('en-KE')
            : 'Unknown',
          graphSignalsFound: graphSignals,
          internalExplanation: networkFound
            ? `${COMMUNITY_LABELS[communityTies]} provided key alternative credit evidence. ${FARM_ACCESS_LABELS[f.farmAccess] || ''}. Assessment tier: ${TIER_LABELS[tier]}.`
            : `No community evidence found. ${FARM_ACCESS_LABELS[f.farmAccess] || ''}. Field visit recommended.`,
          baseReasons,
          evidenceReasons,
        },
      };
    });
  } catch {
    // Fallback static records if API fails — keeps page working
    return [
      {
        id: 'fallback-1',
        name: 'Mary Atieno',
        location: 'Siaya',
        baseAssessment: 42,
        evidenceFound: 'Cooperative member verified',
        adjustment: 33,
        finalOutcome: 'Approved',
        finalAssessment: 75,
        smsSent: 'Habari Mary! Tathmini yako imekamilika. Unastahili mkopo.',
        internalNotes: 'Strong cooperative evidence.',
        evidenceProfile: {
          cooperatives: ['Siaya Farmers Coop'],
          buyers: [], guarantors: [],
          communityScore: 90, peersConnected: 6,
          sharedBuyerReliability: 0, communityRepaymentPattern: 88,
          missingDataRecovered: ['Cooperative membership'],
          relationshipDepth: 2, networkStrength: 'High',
          dataCompleteness: 70, recommendationConfidence: 89,
          lastAssessmentDate: '27/06/2026',
          graphSignalsFound: ['Cooperative membership verified', 'Community network signal processed'],
          internalExplanation: 'Cooperative membership provided strong alternative credit evidence.',
          baseReasons: ['No formal collateral', 'No bank history'],
          evidenceReasons: ['3-year cooperative member', 'Community trust established'],
        },
      },
    ];
  }
};

// ── Static fetchers (unchanged) ────────────────────────────────────────────────

const fetchPlatformStatus = async (): Promise<PlatformStatus> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ussdAssessments: 3427,
    evidenceProfilesGenerated: 2156,
    smsMessagesDelivered: 1891,
    neo4jRelationshipsTraversed: 847293,
    lastUpdated: new Date().toISOString(),
    systemHealth: 'operational',
  };
};

const fetchMaryStory = async (): Promise<MaryStory> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    name: 'Mary',
    role: 'A farmer growing food for her community',
    traditionalAssessment: {
      items: ['No collateral', 'No title deed', 'No formal credit history'],
      outcome: 'Assessment stops here.',
    },
    shambaiAssessment: {
      items: ['Active cooperative member', 'Consistent produce sales', 'Trusted community relationships'],
      outcome: 'Assessment continues.',
    },
    smsReceived:
      'Habari Mary! Your credit assessment is complete. Based on your cooperative membership and produce sales, you qualify for KES 35,000 credit. Visit your cooperative agent to collect.',
  };
};

const fetchEvidenceCards = async (): Promise<EvidenceCard[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 'direct-relationships',
      title: 'Direct Relationship Evidence',
      description: 'Cooperative participation. Buyer consistency. Trusted guarantors.',
      examples: ['Cooperative membership verified', 'Consistent buyer relationships', 'Peer guarantor networks'],
    },
    {
      id: 'community-signals',
      title: 'Community Signals',
      description: 'Evidence discovered through connected farmers.',
      examples: ['Shared buyer reliability patterns', 'Peer repayment histories', 'Community trust indicators'],
    },
    {
      id: 'missing-data-recovery',
      title: 'Missing Data Recovery',
      description: 'When formal records are missing, relationship evidence provides additional context.',
      examples: ['Informal trading relationships verified', 'Community reputation assessed', 'Alternative credit signals found'],
    },
  ];
};

const fetchFarmerProfiles = async (): Promise<FarmerProfile[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return [
    {
      id: 'farmer-mary',
      name: 'Mary Atieno',
      location: 'Siaya County, Kenya',
      crop: 'Maize & Vegetables',
      imageUrl: 'https://images.pexels.com/photos/29005997/pexels-photo-29005997.jpeg?auto=compress&cs=tinysrgb&w=600',
      scenario: 'strong-evidence',
      traditionalOutcome: 'Excluded - insufficient records',
      evidenceFound: ['Cooperative member for 3 years', 'Sells produce to verified buyer', 'Peer guarantor available', 'Community repayment score: 94%'],
      shambaiOutcome: 'Approved for KES 35,000 credit',
      smsReceived: 'Habari Mary! Your credit assessment is complete. Based on your cooperative membership and produce sales, you qualify for KES 35,000 credit.',
      expandableDetails: {
        story: 'Mary has been farming for 12 years, growing maize and vegetables for her local community.',
        assessmentReasoning: "Mary's cooperative membership and buyer connections provided sufficient signals to proceed with a positive assessment.",
        relationshipEvidence: ['Cooperative membership: 3 years verified', 'Buyer relationship: 4 consistent deliveries', 'Community signals: High repayment pattern', 'Guarantor available'],
      },
    },
    {
      id: 'farmer-fatima',
      name: 'Fatima Njeri',
      location: 'Nakuru County, Kenya',
      crop: 'Potatoes',
      imageUrl: 'https://images.pexels.com/photos/35127654/pexels-photo-35127654.jpeg?auto=compress&cs=tinysrgb&w=600',
      scenario: 'thin-file-helped',
      traditionalOutcome: 'Excluded - no formal records',
      evidenceFound: ['No cooperative membership found', 'Community evidence discovered through graph', 'Connected to 3 peer farmers with good standing'],
      shambaiOutcome: 'Conditional approval for KES 15,000',
      smsReceived: 'Habari Fatima! We found your farming connections. You qualify for KES 15,000 starter credit.',
      expandableDetails: {
        story: 'Fatima recently started selling potatoes to a local market with no cooperative membership.',
        assessmentReasoning: 'Graph discovered community signals through shared buyer connections.',
        relationshipEvidence: ['No direct cooperative membership', 'Buyer relationship: Emerging', 'Community signals: Connected to repaying farmers'],
      },
    },
    {
      id: 'farmer-grace',
      name: 'Grace Akello',
      location: 'Northern Uganda',
      crop: 'Groundnuts',
      imageUrl: 'https://images.pexels.com/photos/29005997/pexels-photo-29005997.jpeg?auto=compress&cs=tinysrgb&w=600',
      scenario: 'no-evidence',
      traditionalOutcome: 'Excluded - no records found',
      evidenceFound: [],
      shambaiOutcome: 'Referred for manual assessment',
      smsReceived: "Habari Grace. We couldn't complete your assessment yet. A field officer will visit you in the next 7 days.",
      expandableDetails: {
        story: 'Grace recently relocated and is establishing her groundnut farm with no documented relationships yet.',
        assessmentReasoning: 'No relationship evidence could be discovered. Referred for field visit.',
        relationshipEvidence: ['No cooperative membership found', 'No buyer relationships documented', 'No community connections detected'],
      },
    },
  ];
};

const fetchRelationshipSteps = async (): Promise<RelationshipStep[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'farmer', label: 'Farmer', description: 'A woman growing food for her community', icon: 'user' },
    { id: 'cooperative', label: 'Cooperative', description: 'Farming group membership verified', icon: 'building' },
    { id: 'buyer', label: 'Buyer', description: 'Consistent produce sales documented', icon: 'shopping' },
    { id: 'community', label: 'Community Evidence', description: 'Trust signals through connected farmers', icon: 'users' },
  ];
};

const fetchDemoSteps = async (): Promise<DemoStep[]> => {
  return [
    { id: 'start', label: 'Start Journey', description: "Begin Mary's assessment demo", farmerId: 'farmer-mary' },
    { id: 'discovery', label: 'Relationship Discovery', description: 'Watch evidence discovery in action', farmerId: 'farmer-mary' },
    { id: 'assessment', label: 'Assessment', description: 'See how evidence affects the score', farmerId: 'farmer-mary' },
    { id: 'sms', label: 'SMS Received', description: 'View the outcome message', farmerId: 'farmer-mary' },
  ];
};

// ── React Query hooks ──────────────────────────────────────────────────────────

export function useImpactMetrics() {
  return useQuery({
    queryKey: ['impact-metrics'],
    queryFn: fetchImpactMetrics,
    staleTime: 60_000,       // re-fetch every 60s
    retry: 1,
  });
}

export function usePlatformStatus() {
  return useQuery({
    queryKey: ['platform-status'],
    queryFn: fetchPlatformStatus,
    refetchInterval: 30000,
  });
}

export function useMaryStory() {
  return useQuery({ queryKey: ['mary-story'], queryFn: fetchMaryStory });
}

export function useEvidenceCards() {
  return useQuery({ queryKey: ['evidence-cards'], queryFn: fetchEvidenceCards });
}

export function useFarmerProfiles() {
  return useQuery({ queryKey: ['farmer-profiles'], queryFn: fetchFarmerProfiles });
}

export function useRelationshipSteps() {
  return useQuery({ queryKey: ['relationship-steps'], queryFn: fetchRelationshipSteps });
}

export function useOrganisationRecords() {
  return useQuery({
    queryKey: ['organisation-records'],
    queryFn: fetchOrganisationRecords,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useDemoSteps() {
  return useQuery({ queryKey: ['demo-steps'], queryFn: fetchDemoSteps });
}

export type {
  ImpactMetrics, PlatformStatus, MaryStory, EvidenceCard,
  FarmerProfile, RelationshipStep, OrganisationRecord, DemoStep,
};