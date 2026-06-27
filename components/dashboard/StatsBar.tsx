'use client';
import { useEffect, useState } from 'react';
import { api, DashboardStats } from '@/lib/api';
import { Users, Layers, MapPin, BarChart3 } from 'lucide-react';

export function StatsBar() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-20 bg-gray-900 animate-pulse rounded-xl" />;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Farmers', value: stats.totalFarmers, icon: Users, color: 'text-emerald-400' },
    { label: 'Gold Tier', value: stats.tierBreakdown.find(t => t.tier === 1)?.count ?? 0, icon: Layers, color: 'text-yellow-400' },
    { label: 'Communities', value: stats.communityBreakdown.length, icon: MapPin, color: 'text-blue-400' },
    { label: 'Avg Score', value: stats.totalFarmers ? Math.round(stats.tierBreakdown.reduce((acc, t) => acc + t.count, 0) / stats.tierBreakdown.length) : 0, icon: BarChart3, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{label}</span>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      ))}
    </div>
  );
}