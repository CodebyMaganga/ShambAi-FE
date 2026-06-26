'use client';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/header';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-20 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome, {user.email}</h1>
          <p className="text-gray-300 mb-8">
            This is your field‑officer dashboard. You can view farmer assessments, evidence profiles, and more.
          </p>

          {/* Placeholder dashboard content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['Farmers Assessed', 'Pending Reviews', 'Approved Today'].map((stat) => (
              <div
                key={stat}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <p className="text-sm text-gray-400">{stat}</p>
                <p className="text-2xl font-bold text-white mt-2">--</p>
              </div>
            ))}
          </div>

          {/* You could later import OrganisationViewSection or similar */}
          <div className="mt-12 bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center text-gray-400">
            Detailed farmer records will appear here, based on your previous conversation design.
          </div>
        </div>
      </main>
    </>
  );
}