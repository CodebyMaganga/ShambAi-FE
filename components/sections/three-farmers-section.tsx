'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Wheat, X, CheckCircle, XCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { useFarmerProfiles, type FarmerProfile } from '@/hooks/use-shamb-data';

// Dark-theme colour mapping for scenarios
const scenarioStyles = {
  'strong-evidence': {
    label: 'Strong Evidence',
    badge: 'bg-emerald-500/90 text-white',
    border: 'border-emerald-500/50',
  },
  'thin-file-helped': {
    label: 'Thin-File Helped',
    badge: 'bg-blue-500/90 text-white',
    border: 'border-blue-500/50',
  },
  'no-evidence': {
    label: 'Referral for Support',
    badge: 'bg-amber-500/90 text-gray-900',
    border: 'border-amber-500/50',
  },
};

function FarmerDetailModal({
  farmer,
  onClose,
}: {
  farmer: FarmerProfile;
  onClose: () => void;
}) {
  const styles = scenarioStyles[farmer.scenario];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-900 shadow-2xl"
      >
        {/* Header Image */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img src={farmer.imageUrl} alt={farmer.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/40"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${styles.badge}`}>
              {styles.label}
            </span>
            <h3 className="mt-2 font-serif text-3xl font-bold">{farmer.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Location & Crop */}
          <div className="mb-8 flex flex-wrap gap-4 text-gray-400">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {farmer.location}
            </span>
            <span className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              {farmer.crop}
            </span>
          </div>

          {/* Story */}
          <div className="mb-8">
            <h4 className="mb-3 text-lg font-semibold text-white">Her Story</h4>
            <p className="text-gray-300 leading-relaxed">
              {farmer.expandableDetails.story}
            </p>
          </div>

          {/* Traditional Outcome */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-white">Traditional Outcome</h4>
            <div className="rounded-xl border border-red-900/40 bg-red-950/30 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-200 font-medium">{farmer.traditionalOutcome}</span>
              </div>
            </div>
          </div>

          {/* Evidence Found */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-white">Evidence Found</h4>
            {farmer.evidenceFound.length > 0 ? (
              <ul className="space-y-2">
                {farmer.evidenceFound.map((evidence: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-gray-200">{evidence}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No evidence discovered through current connections.</p>
            )}
          </div>

          {/* Relationship Evidence */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-white">Relationship Evidence</h4>
            <ul className="space-y-2">
              {farmer.expandableDetails.relationshipEvidence.map((evidence: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>{evidence}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ShambAI Outcome */}
          <div className="mb-8">
            <h4 className="mb-3 text-lg font-semibold text-white">ShambAI Outcome</h4>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">{farmer.shambaiOutcome}</span>
              </div>
            </div>
          </div>

          {/* SMS Received */}
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/80 p-5">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">SMS Received</span>
            </div>
            <p className="text-gray-200 leading-relaxed">{farmer.smsReceived}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FarmerCard({
  farmer,
  index,
  onClick,
}: {
  farmer: FarmerProfile;
  index: number;
  onClick: () => void;
}) {
  const styles = scenarioStyles[farmer.scenario];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-2xl border-2 ${styles.border} bg-gray-900 shadow-md transition-all hover:shadow-xl`}
    >
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <motion.img
          src={farmer.imageUrl}
          alt={farmer.name}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Badge */}
        <div className="absolute right-4 top-4">
          <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${styles.badge}`}>
            {styles.label}
          </span>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="font-serif text-3xl font-bold">{farmer.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            {farmer.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Crop */}
        <div className="mb-4 flex items-center gap-2 text-gray-400">
          <Wheat className="h-4 w-4" />
          <span>{farmer.crop}</span>
        </div>

        {/* Outcomes */}
        <div className="mb-4 space-y-3">
          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-3">
            <p className="text-xs font-medium text-red-400">Traditional Outcome</p>
            <p className="text-sm font-medium text-red-200">{farmer.traditionalOutcome}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3">
            <p className="text-xs font-medium text-emerald-400">ShambAI Outcome</p>
            <p className="text-sm font-medium text-emerald-200">{farmer.shambaiOutcome}</p>
          </div>
        </div>

        {/* Click prompt */}
        <motion.div
          animate={{ y: isHovered ? 0 : 5 }}
          className="flex items-center justify-between text-gray-500"
        >
          <span className="text-sm">Click to see full story</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
        </motion.div>
      </div>
    </motion.article>
  );
}

function FarmerCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-md">
      <div className="h-80 bg-gray-800" />
      <div className="p-6 space-y-4">
        <div className="h-4 w-24 rounded bg-gray-800" />
        <div className="h-16 w-full rounded bg-gray-800" />
        <div className="h-16 w-full rounded bg-gray-800" />
      </div>
    </div>
  );
}

export function ThreeFarmersSection() {
  const { data: farmers, isLoading, error } = useFarmerProfiles();
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Three Farmers. Three Journeys.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Each farmer faced the same challenge: missing data. Each was assessed differently
            based on what relationships could be discovered.
          </p>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <FarmerCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            Unable to load farmer profiles.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {farmers?.map((farmer: FarmerProfile, index: number) => (
              <FarmerCard
                key={farmer.id}
                farmer={farmer}
                index={index}
                onClick={() => setSelectedFarmer(farmer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFarmer && (
          <FarmerDetailModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}