'use client';

import { useQuery } from '@tanstack/react-query';

// Impact metrics for the dashboard
interface ImpactMetrics {
  farmersAssessed: number;
  thinFileFarmersHelped: number;
  relationshipSignalsFound: number;
  assessmentsImprovedThroughCommunity: number;
}

// Platform status for live demo
interface PlatformStatus {
  ussdAssessments: number;
  evidenceProfilesGenerated: number;
  smsMessagesDelivered: number;
  neo4jRelationshipsTraversed: number;
  lastUpdated: string;
  systemHealth: 'operational' | 'degraded' | 'maintenance';
}

// Mary's story data
interface MaryStory {
  name: string;
  role: string;
  traditionalAssessment: {
    items: string[];
    outcome: string;
  };
  shambaiAssessment: {
    items: string[];
    outcome: string;
  };
  smsReceived: string;
}

// Evidence discovery card
interface EvidenceCard {
  id: string;
  title: string;
  description: string;
  examples: string[];
}

// Farmer profile for story cards
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

// Relationship step for visual narrative
interface RelationshipStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// Organisation record for MIS table
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

// Demo journey step
interface DemoStep {
  id: string;
  label: string;
  description: string;
  farmerId: string;
}

// API fetchers
const fetchImpactMetrics = async (): Promise<ImpactMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    farmersAssessed: 12847,
    thinFileFarmersHelped: 8234,
    relationshipSignalsFound: 156293,
    assessmentsImprovedThroughCommunity: 5421,
  };
};

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
      examples: [
        'Cooperative membership verified',
        'Consistent buyer relationships',
        'Peer guarantor networks',
      ],
    },
    {
      id: 'community-signals',
      title: 'Community Signals',
      description: 'Evidence discovered through connected farmers.',
      examples: [
        'Shared buyer reliability patterns',
        'Peer repayment histories',
        'Community trust indicators',
      ],
    },
    {
      id: 'missing-data-recovery',
      title: 'Missing Data Recovery',
      description:
        'When formal records are missing, relationship evidence provides additional context.',
      examples: [
        'Informal trading relationships verified',
        'Community reputation assessed',
        'Alternative credit signals found',
      ],
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
      imageUrl:
        'https://images.pexels.com/photos/29005997/pexels-photo-29005997.jpeg?auto=compress&cs=tinysrgb&w=600',
      scenario: 'strong-evidence',
      traditionalOutcome: 'Excluded - insufficient records',
      evidenceFound: [
        'Cooperative member for 3 years',
        'Sells produce to verified buyer',
        'Peer guarantor available',
        'Community repayment score: 94%',
      ],
      shambaiOutcome: 'Approved for KES 35,000 credit',
      smsReceived:
        'Habari Mary! Your credit assessment is complete. Based on your cooperative membership and produce sales, you qualify for KES 35,000 credit. Visit your cooperative agent to collect.',
      expandableDetails: {
        story:
          'Mary has been farming for 12 years, growing maize and vegetables for her local community. Despite having no formal credit history, her consistent cooperative membership and track record of reliable produce sales made her a strong candidate for credit.',
        assessmentReasoning:
          'Mary\'s base assessment score was limited by lack of traditional credit factors. However, relationship evidence from her cooperative membership, buyer connections, and community reputation provided sufficient signals to proceed with a positive assessment.',
        relationshipEvidence: [
          'Cooperative membership: 3 years verified',
          'Buyer relationship: 4 consistent deliveries tracked',
          'Community signals: High repayment pattern in peer network',
          'Guarantor available: Verified cooperative peer',
        ],
      },
    },
    {
      id: 'farmer-fatima',
      name: 'Fatima Njeri',
      location: 'Nakuru County, Kenya',
      crop: 'Potatoes',
      imageUrl:
        'https://images.pexels.com/photos/35127654/pexels-photo-35127654.jpeg?auto=compress&cs=tinysrgb&w=600',
      scenario: 'thin-file-helped',
      traditionalOutcome: 'Excluded - no formal records',
      evidenceFound: [
        'No cooperative membership found',
        'Community evidence discovered through graph',
        'Connected to 3 peer farmers with good standing',
        'Shared buyer reliability: 76%',
      ],
      shambaiOutcome: 'Conditional approval for KES 15,000',
      smsReceived:
        'Habari Fatima! We found your farming connections through your buyer network. You qualify for KES 15,000 starter credit. Join a cooperative to access higher amounts next time.',
      expandableDetails: {
        story:
          'Fatima recently started selling potatoes to a local market. She has no cooperative membership and no formal records. Through graph analysis, ShambAI discovered she shares a buyer with several farmers who have excellent repayment histories.',
        assessmentReasoning:
          'While Fatima lacks direct relationship evidence, the graph discovered community signals through shared buyer connections. Her proximity to farmers with good repayment histories provided enough context for a conditional assessment.',
        relationshipEvidence: [
          'No direct cooperative membership',
          'Buyer relationship: Emerging (3 deliveries)',
          'Community signals: Connected to 3 repaying farmers',
          'Shared buyer reliability: Above threshold',
        ],
      },
    },
    {
      id: 'farmer-grace',
      name: 'Grace Akello',
      location: 'Northern Uganda',
      crop: 'Groundnuts',
      imageUrl:
        'https://images.pexels.com/photos/29005997/pexels-photo-29005997.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&crop=faces',
      scenario: 'no-evidence',
      traditionalOutcome: 'Excluded - no records found',
      evidenceFound: [],
      shambaiOutcome: 'Referred for manual assessment',
      smsReceived:
        'Habari Grace. We couldn\'t complete your assessment yet. A field officer will visit you in the next 7 days to help you build your farming record. Questions? Call 0800-SHAMBAI.',
      expandableDetails: {
        story:
          'Grace recently relocated to a new area and is establishing her groundnut farm. She has no documented farming relationships yet. The graph found no evidence to support an immediate assessment.',
        assessmentReasoning:
          'No relationship evidence could be discovered for Grace. She has been referred for a field visit to help her establish documented farming connections that will support future assessments.',
        relationshipEvidence: [
          'No cooperative membership found',
          'No buyer relationships documented',
          'No community connections detected',
          'Recommended: Join local cooperative, record sales',
        ],
      },
    },
  ];
};

const fetchRelationshipSteps = async (): Promise<RelationshipStep[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'farmer', label: 'Farmer', description: 'A woman growing food for her community', icon: 'user' },
    {
      id: 'cooperative',
      label: 'Cooperative',
      description: 'Farming group membership verified',
      icon: 'building',
    },
    { id: 'buyer', label: 'Buyer', description: 'Consistent produce sales documented', icon: 'shopping' },
    {
      id: 'community',
      label: 'Community Evidence',
      description: 'Trust signals through connected farmers',
      icon: 'users',
    },
  ];
};

const fetchOrganisationRecords = async (): Promise<OrganisationRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 'rec-1',
      name: 'Mary Atieno',
      location: 'Siaya',
      baseAssessment: 42,
      evidenceFound: 'Strong direct + community',
      adjustment: 38,
      finalOutcome: 'Approved',
      evidenceProfile: {
        cooperatives: ['Siaya Farmers Association'],
        buyers: ['County Market Cooperative'],
        guarantors: ['John Otieno'],
        communityScore: 94,
        peersConnected: 8,
        sharedBuyerReliability: 87,
        communityRepaymentPattern: 94,
        missingDataRecovered: ['Cooperative membership', 'Buyer relationship'],
        relationshipDepth: 3,
        networkStrength: 'High',
        dataCompleteness: 78,
        recommendationConfidence: 92,
        lastAssessmentDate: '2024-01-15',
        graphSignalsFound: [
          'Cooperative membership verified through graph',
          'Buyer relationship path discovered (depth 2)',
          'Community trust cluster identified',
        ],
        internalExplanation:
          'Relationship evidence significantly improved the assessment. Mary\'s cooperative membership and buyer relationships provide strong signals of creditworthiness despite thin-file status.',
        baseReasons: ['No credit history', 'No collateral documented', 'No land title'],
        evidenceReasons: [
          '3-year cooperative member',
          'Consistent buyer relationship',
          'Guarantor available',
          'High community scores',
        ],
      },
      smsSent:
        'Habari Mary! Your credit assessment is complete. Based on your cooperative membership and produce sales, you qualify for KES 35,000 credit.',
      internalNotes: 'Strong candidate. Cooperative membership with buyer relationship established trust trajectory.',
      finalAssessment: 80,
    },
    {
      id: 'rec-2',
      name: 'Fatima Njeri',
      location: 'Nakuru',
      baseAssessment: 28,
      evidenceFound: 'Community evidence only',
      adjustment: 27,
      finalOutcome: 'Conditional Approval',
      evidenceProfile: {
        cooperatives: [],
        buyers: ['Nakuru Market'],
        guarantors: [],
        communityScore: 76,
        peersConnected: 3,
        sharedBuyerReliability: 76,
        communityRepaymentPattern: 89,
        missingDataRecovered: ['Community signals through shared buyer'],
        relationshipDepth: 2,
        networkStrength: 'Medium',
        dataCompleteness: 42,
        recommendationConfidence: 68,
        lastAssessmentDate: '2024-01-18',
        graphSignalsFound: [
          'Community cluster analysis performed',
          'Shared buyer path discovered',
          'Peer repayment pattern analyzed',
        ],
        internalExplanation:
          'Graph evidence added significant value. Conditional approval for starter amount. Recommend cooperative enrollment.',
        baseReasons: ['No collateral', 'No land title', 'No borrowing history'],
        evidenceReasons: ['Shared buyer with repaying farmers', 'Emerging delivery pattern', 'Geographic trust network'],
      },
      smsSent:
        'Habari Fatima! We found your farming connections. You qualify for KES 15,000 starter credit. Join a cooperative for higher amounts.',
      internalNotes: 'Thin-file farmer helped by community evidence discovery.',
      finalAssessment: 55,
    },
    {
      id: 'rec-3',
      name: 'Grace Akello',
      location: 'Gulu',
      baseAssessment: 18,
      evidenceFound: 'None discovered',
      adjustment: 0,
      finalOutcome: 'Referred for Manual Review',
      evidenceProfile: {
        cooperatives: [],
        buyers: [],
        guarantors: [],
        communityScore: 0,
        peersConnected: 0,
        sharedBuyerReliability: 0,
        communityRepaymentPattern: 0,
        missingDataRecovered: [],
        relationshipDepth: 0,
        networkStrength: 'None',
        dataCompleteness: 5,
        recommendationConfidence: 15,
        lastAssessmentDate: '2024-01-20',
        graphSignalsFound: [],
        internalExplanation:
          'No graph evidence found. Farmer may be new to area or informal sector. Field verification recommended.',
        baseReasons: ['No credit history', 'No community connections', 'No documented farming relationships'],
        evidenceReasons: [],
      },
      smsSent:
        'Habari Grace. We need more information. A field officer will visit within 7 days. Questions? Call 0800-SHAMBAI.',
      internalNotes: 'Unable to locate relationship evidence. Recommend community introduction program.',
      finalAssessment: 18,
    },
    {
      id: 'rec-4',
      name: 'Josephine Wambui',
      location: 'Kiambu',
      baseAssessment: 55,
      evidenceFound: 'Strong guarantor network',
      adjustment: 25,
      finalOutcome: 'Approved',
      evidenceProfile: {
        cooperatives: ['Kiambu Dairy Farmers'],
        buyers: ['Brookside Dairy'],
        guarantors: ['Peter Mwangi', 'Jane Wambui'],
        communityScore: 92,
        peersConnected: 15,
        sharedBuyerReliability: 94,
        communityRepaymentPattern: 96,
        missingDataRecovered: ['Multiple guarantors verified'],
        relationshipDepth: 4,
        networkStrength: 'Very High',
        dataCompleteness: 91,
        recommendationConfidence: 98,
        lastAssessmentDate: '2024-01-22',
        graphSignalsFound: [
          'Guarantor network mapped (depth 4)',
          'Multiple buyer paths verified',
          'Community hub node identified',
        ],
        internalExplanation:
          'Outstanding relationship profile. Multiple guarantors and buyer relationships provide exceptional confidence.',
        baseReasons: ['Limited formal credit history', 'No land title'],
        evidenceReasons: ['5-year co op membership', '2 verified guarantors', 'Consistent buyer relationship'],
      },
      smsSent:
        'Habari Josephine! Your assessment is approved. Based on your excellent cooperative record, you qualify for KES 55,000 credit.',
      internalNotes: 'Highly recommended. Strong relationship profile across multiple dimensions.',
      finalAssessment: 80,
    },
  ];
};

const fetchDemoSteps = async (): Promise<DemoStep[]> => {
  return [
    { id: 'start', label: 'Start Journey', description: 'Begin Mary\'s assessment demo', farmerId: 'farmer-mary' },
    {
      id: 'discovery',
      label: 'Relationship Discovery',
      description: 'Watch evidence discovery in action',
      farmerId: 'farmer-mary',
    },
    { id: 'assessment', label: 'Assessment', description: 'See how evidence affects the score', farmerId: 'farmer-mary' },
    { id: 'sms', label: 'SMS Received', description: 'View the outcome message', farmerId: 'farmer-mary' },
  ];
};

// React Query hooks
export function useImpactMetrics() {
  return useQuery({
    queryKey: ['impact-metrics'],
    queryFn: fetchImpactMetrics,
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
  return useQuery({
    queryKey: ['mary-story'],
    queryFn: fetchMaryStory,
  });
}

export function useEvidenceCards() {
  return useQuery({
    queryKey: ['evidence-cards'],
    queryFn: fetchEvidenceCards,
  });
}

export function useFarmerProfiles() {
  return useQuery({
    queryKey: ['farmer-profiles'],
    queryFn: fetchFarmerProfiles,
  });
}

export function useRelationshipSteps() {
  return useQuery({
    queryKey: ['relationship-steps'],
    queryFn: fetchRelationshipSteps,
  });
}

export function useOrganisationRecords() {
  return useQuery({
    queryKey: ['organisation-records'],
    queryFn: fetchOrganisationRecords,
  });
}

export function useDemoSteps() {
  return useQuery({
    queryKey: ['demo-steps'],
    queryFn: fetchDemoSteps,
  });
}

export type {
  ImpactMetrics,
  PlatformStatus,
  MaryStory,
  EvidenceCard,
  FarmerProfile,
  RelationshipStep,
  OrganisationRecord,
  DemoStep,
};
