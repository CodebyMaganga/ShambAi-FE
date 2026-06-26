'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';

interface HeroSectionProps {
  onSeeMaryStory: () => void;
  onRunDemo: () => void;
}

export function HeroSection({ onSeeMaryStory, onRunDemo }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen w-full bg-gray-950 overflow-hidden">
      {/* Full‑width background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/29005997/pexels-photo-29005997.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="African woman farmer working in her field"
          className="h-full w-full object-cover"
        />
        {/* Dark gradient overlay – ensures text remains readable on all devices */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/40" />
      </div>

      {/* Content – full width but centered with max‑width for readability */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Traditional credit systems stop at missing data.
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-emerald-400 mb-8">
              ShambAI looks for relationship evidence before saying no.
            </h2>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl"
          >
            An explainable credit assessment experience designed for women
            smallholder farmers using feature phones.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={onSeeMaryStory}
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              See Mary&apos;s Story
              <ArrowDown className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={onRunDemo}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-400 hover:border-white text-gray-200 hover:text-white font-medium rounded-lg transition-colors"
            >
              <Play className="mr-2 h-5 w-5" />
              Run Demo Journey
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="h-6 w-10 rounded-full border-2 border-gray-500/30 p-1">
            <div className="h-2 w-2 rounded-full bg-gray-400/50" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}