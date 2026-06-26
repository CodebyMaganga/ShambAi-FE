'use client';

import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';

const partners = [
  { name: 'Acumen', href: 'https://acumen.org' },
  { name: 'Mercy Corps AgriFin', href: 'https://mercycorpsagrifin.org' },
  { name: 'World Bank', href: 'https://worldbank.org' },
];

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 px-6 py-20 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Core Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
            Missing data is not a penalty.
          </h2>
          <p className="mt-2 text-lg font-semibold text-emerald-400">
            It is an opportunity to look deeper.
          </p>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="mb-6 text-center text-sm uppercase tracking-widest text-gray-500">
            In Partnership With
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                {partner.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 border-t border-gray-800 pt-8"
        >
          <p className="flex items-center gap-1 text-sm text-gray-400">
            Made with <Heart className="h-4 w-4 fill-red-400 text-red-400" /> for financial
            inclusion
          </p>
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} ShambAI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}