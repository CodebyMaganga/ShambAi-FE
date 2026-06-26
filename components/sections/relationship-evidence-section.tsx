'use client';

import { motion } from 'framer-motion';
import { User, Building, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { useRelationshipSteps, type RelationshipStep } from '@/hooks/use-shamb-data';

const iconMap = {
  user: User,
  building: Building,
  shopping: ShoppingBag,
  users: Users,
};

// Dark‑mode colour sets for each step (indexed)
const stepColors = [
  {
    bg: 'bg-blue-950/40',
    icon: 'text-blue-300',
    line: 'bg-blue-700/50',
    arrowBg: 'bg-blue-800/50',
  },
  {
    bg: 'bg-emerald-950/40',
    icon: 'text-emerald-300',
    line: 'bg-emerald-700/50',
    arrowBg: 'bg-emerald-800/50',
  },
  {
    bg: 'bg-amber-950/40',
    icon: 'text-amber-300',
    line: 'bg-amber-700/50',
    arrowBg: 'bg-amber-800/50',
  },
  {
    bg: 'bg-purple-950/40',
    icon: 'text-purple-300',
    line: 'bg-purple-700/50',
    arrowBg: 'bg-purple-800/50',
  },
];

function RelationshipStepComponent({
  step,
  index,
  isLast,
}: {
  step: RelationshipStep;
  index: number;
  isLast: boolean;
}) {
  const Icon = iconMap[step.icon as keyof typeof iconMap] || User;
  const colors = stepColors[index] || stepColors[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex flex-col items-center"
    >
      {/* Icon */}
      <div
        className={`relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${colors.bg} shadow-sm`}
      >
        <Icon className={`h-10 w-10 ${colors.icon}`} />
      </div>

      {/* Label */}
      <h3 className="font-serif text-xl font-semibold text-white">{step.label}</h3>

      {/* Description */}
      <p className="mt-1 text-center text-sm text-gray-400">{step.description}</p>

      {/* Arrow (desktop) */}
      {!isLast && (
        <div className="absolute -right-4 top-10 hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.15 }}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.arrowBg}`}
          >
            <ArrowRight className={`h-4 w-4 ${colors.icon}`} />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function RelationshipEvidenceSection() {
  const { data: steps, isLoading, error } = useRelationshipSteps();

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Relationship Evidence Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Evidence is discovered through connections. When a farmer is connected to a
            cooperative, buyer, or community, trust signals emerge.
          </p>
        </motion.div>

        {/* Visual Flow */}
        {isLoading ? (
          <div className="animate-pulse flex justify-center gap-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-4 h-20 w-20 rounded-2xl bg-gray-800" />
                <div className="h-6 w-20 rounded bg-gray-800" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            Unable to load relationship steps.
          </div>
        ) : steps ? (
          <div className="relative grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
            {/* Desktop connecting line */}
            <div className="absolute left-1/4 right-1/4 top-10 hidden h-0.5 bg-gradient-to-r from-blue-700/50 via-emerald-700/50 via-amber-700/50 to-purple-700/50 md:block" />

            {steps.map((step: RelationshipStep, index: number) => (
              <RelationshipStepComponent
                key={step.id}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        ) : null}

        {/* Bottom explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/80 p-8 max-w-3xl mx-auto text-center">
            <p className="text-gray-300 leading-relaxed">
              Each connection adds a layer of trust. A farmer with cooperative membership,
              consistent buyer relationships, and community connections receives a stronger
              assessment than one with no documented farming relationships.
            </p>
            <p className="mt-4 font-medium text-white">
              The deeper the connections, the stronger the evidence.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}