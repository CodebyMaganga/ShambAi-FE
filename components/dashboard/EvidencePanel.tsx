'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Wheat, Clock, CheckCircle, XCircle, Network } from 'lucide-react';
import { api, Farmer, Assessment,getCropDisplay } from '@/lib/api';

interface EvidencePanelProps {
  farmer: Farmer | null;
  onClose: () => void;
}

export function EvidencePanel({ farmer, onClose }: EvidencePanelProps) {
  const [detail, setDetail] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!farmer?.phoneHash) return;
    setLoading(true);
    api.farmerDetail(farmer.phoneHash)
      .then(data => setDetail(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [farmer?.phoneHash]);

  const latestAssessment: Assessment | undefined = detail?.assessmentHistory?.[0];

  return (
    <AnimatePresence>
      {farmer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-gray-900 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Farmer Detail</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>

              {loading && <p className="text-gray-400">Loading…</p>}
              {error && <p className="text-red-400">{error}</p>}

              {detail && (
                <>
                  {/* … all the same detail content, using detail.location, detail.cropType, etc. … */}
                  {/* I'm keeping the full content from the earlier example, but you can drop the exact same JSX. */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white font-mono text-lg">{detail.phoneHash.slice(0, 2)}</div>
                      <div>
                        <p className="text-white font-mono text-sm">{detail.phoneHash.slice(0, 20)}…</p>
                        <p className="text-gray-400 text-xs">Hash ID</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6 text-gray-300 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-500" /> {detail.location}</span>
                    <span className="flex items-center gap-1">
  <Wheat className="h-4 w-4 text-gray-500" /> {getCropDisplay(detail.cropType)}
</span>
                    <span className="flex items-center gap-1"><Network className="h-4 w-4 text-gray-500" /> {detail.communityTies}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-gray-500" /> {new Date(detail.lastScoredAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-6 flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      detail.currentTier === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      detail.currentTier === 2 ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>Tier {detail.currentTier}</span>
                    <span className="text-gray-400 text-sm">Score: {detail.currentScore ?? '—'}</span>
                  </div>

                  {latestAssessment && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-3">Latest Assessment</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <p className="text-xs text-gray-500">Tier</p>
                          <p className="text-white font-bold">{latestAssessment.tier}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <p className="text-xs text-gray-500">Pts to next tier</p>
                          <p className="text-white font-bold">{latestAssessment.ptsToNextTier}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Answers</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          {Object.entries(latestAssessment.answers).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-gray-400">
                              <span className="text-gray-500">{key}:</span>
                              <span>{val ?? '—'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Evidence</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          {Object.entries(latestAssessment.evidence).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-gray-400">
                              <span className="text-gray-500">{key}:</span>
                              <span>{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {latestAssessment.gaps.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-300 mb-2">Gaps</p>
                          <ul className="space-y-1">
                            {latestAssessment.gaps.map(gap => (
                              <li key={gap} className="flex items-center gap-2 text-red-400 text-sm"><XCircle className="h-3 w-3" /> {gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {detail.assessmentHistory && detail.assessmentHistory.length > 1 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">History</h4>
                      <div className="space-y-3">
                        {detail.assessmentHistory.slice(1).map((assessment: Assessment, i: number) => (
                          <div key={i} className="bg-gray-800/30 rounded-xl p-4 flex justify-between text-sm">
                            <div>
                              <p className="text-gray-300">Tier {assessment.tier}</p>
                              <p className="text-gray-500 text-xs">{new Date(assessment.scoredAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400">Pts to next: {assessment.ptsToNextTier}</p>
                              {assessment.gaps.length > 0 && <p className="text-red-400 text-xs">{assessment.gaps.length} gaps</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}