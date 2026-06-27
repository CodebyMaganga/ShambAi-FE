// src/components/dashboard/TierBadge.tsx
import React from 'react';

const CONFIG: Record<number, { label: string; classes: string }> = {
  1: { label: 'Gold',    classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  2: { label: 'Silver',  classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  3: { label: 'Bronze',  classes: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  4: { label: 'Decline', classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

export function TierBadge({ tier }: { tier: number }) {
  const cfg = CONFIG[tier] || { label: 'Unknown', classes: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}