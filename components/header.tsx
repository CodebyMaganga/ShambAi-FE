'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { LoginDrawer } from './login-drawer';

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 py-4 ${
      transparent ? '' : 'bg-gray-950/80 backdrop-blur-md border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="text-white font-bold text-lg">ShambAI</span>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300 text-sm hidden sm:inline">{user.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
      <LoginDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}