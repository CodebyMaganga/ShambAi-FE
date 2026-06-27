// src/components/dashboard/FarmerTable.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { api, Farmer } from '@/lib/api';
import { TierBadge } from './TierBadge';

const COUNTIES = ['Kiambu', "Murang'a", 'Machakos', 'Nakuru', 'Nyeri'];
const CROP_LABELS: Record<string, string> = {
  crops: 'Maize/Beans', dairy: 'Dairy', horticulture: 'Horticulture', mixed: 'Mixed',
};
const COMMUNITY_LABELS: Record<string, string> = {
  chama: 'Chama', sacco: 'SACCO', coop: 'Cooperative', none: 'None',
};
const REASON_LABELS: Record<string, string> = {
  strong_community_ties: 'Strong community ties',
  good_cashflow: 'Good M-Pesa cashflow',
  strong_social_network: 'Strong network',
  good_overall: 'Good overall',
  low_cashflow: 'Low cashflow',
  high_weather_risk: 'Weather risk',
  high_location_risk: 'Location risk',
  past_default: 'Past default',
};

interface Props {
  onSelectFarmer: (f: Farmer) => void;
}

export function FarmerTable({ onSelectFarmer }: Props) {
  const [farmers, setFarmers]   = useState<Farmer[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Filters
  const [location, setLocation]           = useState('');
  const [tier, setTier]                   = useState('');
  const [communityTies, setCommunityTies] = useState('');
  const [cropType, setCropType]           = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.farmers({
        location:      location || undefined,
        tier:          tier || undefined,
        communityTies: communityTies || undefined,
        cropType:      cropType || undefined,
        page,
        limit: 20,
        sortBy: 'lastScoredAt',
        sortDir: 'desc',
      });
      setFarmers(res.farmers);
      setTotal(res.total);
      setPages(res.pages);
    } catch {
      setError('Could not load farmers. Check your API connection.');
    } finally {
      setLoading(false);
    }
  }, [location, tier, communityTies, cropType, page]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [location, tier, communityTies, cropType]);

  const handleExport = () => {
    const params: Record<string, string> = {};
    if (location)      params.location      = location;
    if (tier)          params.tier          = tier;
    if (communityTies) params.communityTies = communityTies;
    if (cropType)      params.cropType      = cropType;
    window.open(api.exportUrl(params), '_blank');
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="p-5 border-b border-gray-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={location} onChange={e => setLocation(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="">All counties</option>
            {COUNTIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>

          <select
            value={tier} onChange={e => setTier(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="">All tiers</option>
            <option value="1">Gold (Tier 1)</option>
            <option value="2">Silver (Tier 2)</option>
            <option value="3">Bronze (Tier 3)</option>
            <option value="4">Decline (Tier 4)</option>
          </select>

          <select
            value={communityTies} onChange={e => setCommunityTies(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="">All community types</option>
            <option value="chama">Chama</option>
            <option value="sacco">SACCO</option>
            <option value="coop">Cooperative</option>
            <option value="none">No group</option>
          </select>

          <select
            value={cropType} onChange={e => setCropType(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="">All crop types</option>
            <option value="crops">Maize / Beans</option>
            <option value="dairy">Dairy</option>
            <option value="horticulture">Horticulture</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <span className="text-sm text-gray-500 self-center">{total} farmers</span>
          <button
            onClick={handleExport}
            className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg px-4 py-2 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="p-8 text-center text-red-400 text-sm">{error}</div>
      ) : loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-3">Loading farmers...</p>
        </div>
      ) : farmers.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400 font-medium">No farmers match your filters</p>
          <p className="text-gray-600 text-sm mt-1">
            Farmers appear here after completing a USSD assessment on *384*16051#
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Farmer ID', 'Location', 'Crop', 'Community', 'Score', 'Tier', 'Top Signal', 'Assessed', ''].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {farmers.map(f => (
                <tr
                  key={f.phoneHash}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => onSelectFarmer(f)}
                >
                  <td className="px-5 py-4 font-mono text-gray-400 text-xs">
                    {f.phoneHash.slice(0, 10)}…
                  </td>
                  <td className="px-5 py-4 text-gray-300 capitalize">{f.location}</td>
                  <td className="px-5 py-4 text-gray-300">{CROP_LABELS[f.cropType] || f.cropType}</td>
                  <td className="px-5 py-4 text-gray-300">{COMMUNITY_LABELS[f.communityTies] || f.communityTies}</td>
                  <td className="px-5 py-4">
                    <span className="text-white font-semibold">{f.currentScore ?? '—'}</span>
                    <span className="text-gray-600 text-xs">/100</span>
                  </td>
                  <td className="px-5 py-4"><TierBadge tier={f.currentTier} /></td>
                  <td className="px-5 py-4 text-gray-400 text-xs max-w-[160px] truncate">
                    {REASON_LABELS[f.currentTopReason] || f.currentTopReason || '—'}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {f.lastScoredAt ? new Date(f.lastScoredAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-green-500 text-xs hover:text-green-400">View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs bg-gray-800 disabled:opacity-40 hover:bg-gray-700 text-gray-300 rounded px-3 py-1.5 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="text-xs bg-gray-800 disabled:opacity-40 hover:bg-gray-700 text-gray-300 rounded px-3 py-1.5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}