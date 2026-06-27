'use client';
import { useEffect, useState } from 'react';
import { api, Farmer } from '@/lib/api';
import { ChevronRight } from 'lucide-react';
import { getCropDisplay } from '@/lib/api';

interface FarmerTableProps {
  onSelectFarmer: (farmer: Farmer) => void;
}

export function FarmerTable({ onSelectFarmer }: FarmerTableProps) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.farmers({ page, limit: 15 })
      .then(data => {
        setFarmers(data.farmers);
        setTotalPages(data.pages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded" />)}</div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="pb-3 font-medium">Phone Hash</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Crop</th>
              <th className="pb-3 font-medium">Tier</th>
              <th className="pb-3 font-medium">Score</th>
              <th className="pb-3 font-medium">Assessments</th>
              <th className="pb-3 font-medium">Last Scored</th>
              <th className="pb-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {farmers.map(farmer => (
              <tr
                key={farmer.phoneHash}
                className="hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => onSelectFarmer(farmer)}
              >
                <td className="py-3 text-white font-mono text-xs">{farmer.phoneHash.slice(0, 12)}…</td>
                <td className="py-3 text-gray-300 capitalize">{farmer.location}</td>
                <td className="py-3 text-gray-300 capitalize">
  {getCropDisplay(farmer.cropType)}
</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    farmer.currentTier === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    farmer.currentTier === 2 ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>Tier {farmer.currentTier}</span>
                </td>
                <td className="py-3 text-gray-300">{farmer.currentScore ?? '—'}</td>
                <td className="py-3 text-gray-300">{farmer.assessmentCount}</td>
                <td className="py-3 text-gray-500 text-xs">
                  {new Date(farmer.lastScoredAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-gray-500"><ChevronRight className="h-4 w-4" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-gray-700 disabled:opacity-50 hover:bg-gray-800">Previous</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-gray-700 disabled:opacity-50 hover:bg-gray-800">Next</button>
        </div>
      </div>
    </>
  );
}