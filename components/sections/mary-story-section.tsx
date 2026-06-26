'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { useMaryStory } from '@/hooks/use-shamb-data';

export function MaryStorySection() {
  const { data: mary, isLoading, error } = useMaryStory();
  const [showShambai, setShowShambai] = useState(false);

  if (isLoading) {
    return (
      <section className="w-full bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 rounded-lg bg-gray-800" />
            <div className="h-48 w-full rounded-xl bg-gray-800" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !mary) {
    return (
      <section className="w-full bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            Unable to load Mary&apos;s story.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Mary.</h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            Mary grows food for her community.
          </p>
          <p className="text-lg text-gray-300 mt-2 max-w-2xl">
            Traditional systems saw missing information.
          </p>
          <p className="text-lg text-emerald-400 mt-2 font-medium max-w-2xl">
            ShambAI saw relationships.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Traditional Assessment Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-red-900/50 bg-red-950/30 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-red-900/50 p-2">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-300">Traditional Assessment</h3>
            </div>

            <ul className="mb-6 space-y-3">
              {mary.traditionalAssessment.items.map((item: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-red-200"
                >
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span className="body-md">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="border-t border-red-800/50 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-300">Outcome:</span>
                <span className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white">
                  {mary.traditionalAssessment.outcome}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ShambAI Assessment Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-300">ShambAI Assessment</h3>
            </div>

            <ul className="mb-6 space-y-3">
              {mary.shambaiAssessment.items.map((item: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 text-emerald-200"
                >
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="body-md">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="border-t border-emerald-800/50 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-300">Outcome:</span>
                <span className="rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white">
                  {mary.shambaiAssessment.outcome}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SMS Received */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/80 p-6 max-w-2xl mx-auto">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-gray-700 p-2">
                <MessageSquare className="h-5 w-5 text-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-400">SMS Received</span>
            </div>
            <p className="text-gray-200 leading-relaxed">
              {mary.smsReceived}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}