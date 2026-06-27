// src/components/dashboard/StatsBar.tsx
'use client';
import { useEffect, useState } from 'react';
import { api, DashboardStats } from '@/lib/api';

const TIER_COLORS: Record<string, string> = {
  Gold: 'text-yellow-400', Silver: 'text-blue-400',
  Bronze: 'text-orange-400', Decline: 'text-red-400',
};

export function StatsBar({ location }: { location?: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats({ location })
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [location]);

  const tier1 = stats?.tierBreakdown.find(t => t.tier === 1)?.count ?? 0;
  const tier4 = stats?.tierBreakdown.find(t => t.tier === 4)?.count ?? 0;
  const pendingReviews = stats ? stats.totalFarmers - tier1 - tier4 : 0;

  const cards = [
    {
      label: 'Farmers Assessed',
      value: loading ? '—' : String(stats?.totalFarmers ?? 0),
      sub: 'Total assessments',
      color: 'text-green-400',
    },
    {
      label: 'Approved (Gold)',
      value: loading ? '—' : String(tier1),
      sub: 'Tier 1 — ready to lend',
      color: 'text-yellow-400',
    },
    {
      label: 'Under Review',
      value: loading ? '—' : String(pendingReviews),
      sub: 'Silver & Bronze tier',
      color: 'text-blue-400',
    },
    {
      label: 'Declined',
      value: loading ? '—' : String(tier4),
      sub: 'Tier 4 — evidence gaps',
      color: 'text-red-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.label}</p>
          <p className={`text-3xl font-bold ${c.color} font-serif`}>{c.value}</p>
          <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
        </div>
      ))}

      {/* Community breakdown */}
      {stats && stats.communityBreakdown.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Community ties breakdown</p>
          <div className="flex flex-wrap gap-3">
            {stats.communityBreakdown.map(c => (
              <div key={c.type} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-white capitalize">{c.type || 'None'}</span>
                <span className="text-xs text-gray-400">{c.count} farmers</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}