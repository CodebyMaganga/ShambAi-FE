'use client';

export const dynamic = 'force-dynamic'; 

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { FarmerTable } from '@/components/dashboard/FarmerTable';
import { EvidencePanel } from '@/components/dashboard/EvidencePanel';
import { Farmer } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const firstName = user.email?.split('@')[0]?.split('.')[0] ?? 'Officer';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-20 px-6 md:px-8 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="pt-6 flex items-start justify-between">
            <div>
              <p className="text-xs text-emerald-500 uppercase tracking-widest font-semibold mb-1">Field Officer Dashboard</p>
              <h1 className="text-3xl font-bold text-white">Welcome back, {displayName}</h1>
              <p className="text-gray-400 mt-1 text-sm">{user.email} · ShambAI Evidence Discovery Engine</p>
            </div>
            <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 text-right">
              <p className="text-xs text-gray-500">Farmer USSD code</p>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-0.5">*384*38200#</p>
            </div>
          </div>

          <StatsBar />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Farmer Assessments</h2>
              <span className="text-xs text-gray-500">Click any row to open the evidence panel</span>
            </div>
            <FarmerTable onSelectFarmer={setSelectedFarmer} />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Farmer dials USSD', desc: 'Farmer calls *384*16051# on any feature phone. 7–9 questions, under 2 minutes.', color: 'text-emerald-400' },
              { step: '02', title: 'Evidence discovered', desc: 'ShambAI queries M-Pesa, weather data, and Neo4j cooperative networks to build an evidence graph.', color: 'text-blue-400' },
              { step: '03', title: 'Officer verifies', desc: 'You review the evidence, upload documents, verify community ties, and add field notes.', color: 'text-amber-400' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className={`text-xs font-mono font-bold ${color} mb-2`}>{step}</p>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <EvidencePanel farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />
    </>
  );
}