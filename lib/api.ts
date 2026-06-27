// src/lib/api.ts
/**
 * ShambAI dashboard API client.
 * All calls go to the Express backend at NEXT_PUBLIC_API_URL.
 * Set this in .env.local:  NEXT_PUBLIC_API_URL=http://localhost:3000
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalFarmers: number;
  tierBreakdown: { tier: number; label: string; count: number }[];
  communityBreakdown: { type: string; count: number }[];
  cropBreakdown: { cropType: string; count: number }[];
}

export interface Farmer {
  _id: string;
  phoneHash: string;
  location: string;
  cropType: string;
  communityTies: string;
  currentTier: number;
  currentScore: number | null;
  lastScoredAt: string;
  assessmentCount: number;
  assessmentHistory?: Assessment[];
}
export interface Assessment {
  scoredAt: string;
  tier: number;
  gaps: string[];
  ptsToNextTier: number;
  answers: Record<string, any>;
  evidence: Record<string, any>;
}

export interface FarmerListResponse {
  total: number;
  page: number;
  pages: number;
  farmers: Farmer[];
}

export interface LocationSummary {
  _id: string;
  totalFarmers: number;
  avgScore: number;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  tier4Count: number;
}

export interface Chama {
  id: string;
  county: string;
  subCounty: string;
  ward: string;
  name: string;
  type: string;
  memberCount: number;
  active: boolean;
}

export interface EvidenceRecord {
  mpesaStatement: { uploaded: boolean; filename: string | null };
  chama: { id: string | null; name: string | null; verified: boolean };
  land: { type: string | null; uploaded: boolean; filename: string | null };
  communityVerification: {
    chamaMembershipVerified: boolean;
    cooperativeMemberVerified: boolean;
    womensGroupLeaderConfirmed: boolean;
  };
  notes: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const api = {
  stats: (params?: { location?: string; dateFrom?: string; dateTo?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<DashboardStats>(`/dashboard/stats${q ? `?${q}` : ''}`);
  },

  farmers: (params?: {
    location?: string; tier?: string; communityTies?: string; cropType?: string;
    page?: number; limit?: number; sortBy?: string; sortDir?: string;
  }) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
    ).toString();
    return get<FarmerListResponse>(`/dashboard/farmers${q ? `?${q}` : ''}`);
  },

  farmerDetail: (phoneHash: string) =>
    get<Farmer & { assessmentHistory: unknown[] }>(`/dashboard/farmers/${phoneHash}`),

  locations: () => get<LocationSummary[]>('/dashboard/locations'),

  chamas: (county?: string) =>
    get<Chama[]>(`/dashboard/chamas${county ? `?county=${county}` : ''}`),

  evidence: (phoneHash: string) =>
    get<EvidenceRecord>(`/dashboard/farmers/${phoneHash}/evidence`),

  saveEvidence: (phoneHash: string, body: Record<string, unknown>) =>
    post<{ success: boolean; message: string }>(`/dashboard/farmers/${phoneHash}/evidence`, body),

  exportUrl: (params?: Record<string, string>) => {
    const q = new URLSearchParams(params || {}).toString();
    return `${BASE}/dashboard/export${q ? `?${q}` : ''}`;
  },

  uploadFile: async (file: File): Promise<{ filename: string; url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/dashboard/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};