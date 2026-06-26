'use client';

import { motion } from 'framer-motion';
import { Users, GitBranch, Search } from 'lucide-react';
import { useEvidenceCards, type EvidenceCard } from '@/hooks/use-shamb-data';

const iconMap = {
  'direct-relationships': Users,
  'community-signals': GitBranch,
  'missing-data-recovery': Search,
};

// Dark-theme colour mapping
const colorMap = {
  'direct-relationships': {
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  'community-signals': {
    bg: 'bg-blue-950/40',
    border: 'border-blue-800/40',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
  },
  'missing-data-recovery': {
    bg: 'bg-purple-950/40',
    border: 'border-purple-800/40',
    text: 'text-purple-300',
    dot: 'bg-purple-400',
  },
};

function EvidenceCardComponent({
  card,
  index,
}: {
  card: EvidenceCard;
  index: number;
}) {
  const Icon = iconMap[card.id as keyof typeof iconMap] || Users;
  const colors = colorMap[card.id as keyof typeof colorMap] || colorMap['community-signals'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`rounded-xl border ${colors.border} ${colors.bg} p-8 backdrop-blur-sm`}
    >
      <div className={`mb-6 inline-flex rounded-xl ${colors.bg} p-3`}>
        <Icon className={`h-6 w-6 ${colors.text}`} />
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>

      <p className="text-gray-300 mb-6">{card.description}</p>

      <ul className="space-y-2">
        {card.examples.map((example: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-gray-200">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
            <span className="text-sm">{example}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function EvidenceCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 animate-pulse">
      <div className="mb-6 h-12 w-12 rounded-xl bg-gray-800" />
      <div className="mb-3 h-6 w-40 rounded bg-gray-800" />
      <div className="mb-6 h-16 w-full rounded bg-gray-800" />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-800" />
        ))}
      </div>
    </div>
  );
}

export function EvidenceDiscoverySection() {
  const { data: cards, isLoading, error } = useEvidenceCards();

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What We Found When We Looked Deeper
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            When traditional records are missing, these are the signals we discover.
          </p>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <EvidenceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            Unable to load evidence data.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {cards?.map((card: EvidenceCard, index: number) => (
              <EvidenceCardComponent key={card.id} card={card} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}