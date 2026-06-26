'use client';

import { motion } from 'framer-motion';
import { Users, Heart, Network, TrendingUp } from 'lucide-react';
import { useImpactMetrics } from '@/hooks/use-shamb-data';

const metricsConfig = [
  {
    key: 'farmersAssessed' as const,
    label: 'Farmers Assessed',
    icon: Users,
    description: 'Total farmers evaluated through ShambAI',
  },
  {
    key: 'thinFileFarmersHelped' as const,
    label: 'Thin-File Farmers Helped',
    icon: Heart,
    description: 'Farmers with no formal records who received assessments',
  },
  {
    key: 'relationshipSignalsFound' as const,
    label: 'Relationship Evidence Signals Found',
    icon: Network,
    description: 'Trust signals discovered through graph analysis',
  },
  {
    key: 'assessmentsImprovedThroughCommunity' as const,
    label: 'Assessments Improved Through Community Evidence',
    icon: TrendingUp,
    description: 'Farmers whose scores improved based on community signals',
  },
];

function MetricCard({
  metric,
  index,
  isLoading,
}: {
  metric: { key: string; label: string; icon: React.ElementType; description: string };
  index: number;
  isLoading: boolean;
}) {
  const Icon = metric.icon;
  const { data: metrics } = useImpactMetrics();
  const value = metrics ? metrics[metric.key as keyof typeof metrics] || 0 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="mb-4 inline-flex rounded-xl bg-gray-800 p-4">
        <Icon className="h-6 w-6 text-emerald-400" />
      </div>

      {isLoading ? (
        <div className="mx-auto mb-2 h-16 w-32 animate-pulse rounded-lg bg-gray-800" />
      ) : (
        <p className="text-4xl font-bold text-white">{value.toLocaleString()}</p>
      )}

      <p className="mt-2 font-medium text-white">{metric.label}</p>
      <p className="mt-1 text-sm text-gray-400">{metric.description}</p>
    </motion.div>
  );
}

export function ImpactSection() {
  const { isLoading, error } = useImpactMetrics();

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Impact</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real outcomes for real farmers. These metrics reflect farmers who would have
            been excluded by traditional systems but were assessed fairly by ShambAI.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            Unable to load impact metrics.
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {metricsConfig.map((metric, index) => (
              <MetricCard key={metric.key} metric={metric} index={index} isLoading={isLoading} />
            ))}
          </div>
        )}

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-700 bg-gray-900 px-6 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-gray-400">
              Metrics updated in real-time from live platform
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}