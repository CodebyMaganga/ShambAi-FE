// components/dashboard/EvidencePanel.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Wheat, Clock, CheckCircle, XCircle, Network,
  Upload, FileText, AlertCircle
} from 'lucide-react';
import { api, Farmer, Assessment } from '@/lib/api';
import { getCropDisplay } from '@/lib/api'; // helper from lib/api.ts

/* ── helpers ──────────────────────────────────────────────────── */
function formatFieldName(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function safeValue(val: unknown): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

/* ── action mapping (from backend explainer.js) ───────────────── */
const GAP_ACTIONS: Record<string, {
  action_sw: string;
  action_en: string;
  outcome_sw: string;
  outcome_en: string;
  weeks: number;
}> = {
  no_loan_history: {
    action_sw: 'Omba mkopo mdogo wa KES 2,000 sasa na ulipe kwa wakati',
    action_en: 'Take a KES 2,000 starter loan and repay on time',
    outcome_sw: 'mkopo mkubwa zaidi msimu ujao',
    outcome_en: 'a larger loan next season',
    weeks: 12,
  },
  defaulted: {
    action_sw: 'Anza kulipa deni lako la zamani, hata kidogo kwa wakati',
    action_en: 'Start repaying your previous loan, even in small amounts on time',
    outcome_sw: 'nafasi ya mkopo mpya baada ya malipo 3',
    outcome_en: 'a new loan opportunity after 3 payments',
    weeks: 16,
  },
  no_coop: {
    action_sw: 'Jiunge na ushirika au chama cha akiba karibu nawe',
    action_en: 'Join a cooperative or savings group near you',
    outcome_sw: 'ongezeko kubwa katika kiwango chako',
    outcome_en: 'a significant increase in your tier',
    weeks: 12,
  },
  inactive_coop: {
    action_sw: 'Rejesha ushiriki wako amilifu katika ushirika',
    action_en: 'Reactivate your cooperative membership',
    outcome_sw: 'kiwango cha juu zaidi',
    outcome_en: 'a higher tier',
    weeks: 8,
  },
  no_group: {
    action_sw: 'Jiunge na chama cha akiba na uchangie kwa miezi 3',
    action_en: 'Join a savings group (chama) and contribute for 3 months',
    outcome_sw: 'ongezeko la kiwango chako',
    outcome_en: 'an improved tier',
    weeks: 12,
  },
  low_mpesa: {
    action_sw: 'Tumia M-Pesa kupokea na kutuma pesa kila wiki',
    action_en: 'Use M-Pesa to send and receive money every week',
    outcome_sw: 'historia nzuri ya miamala',
    outcome_en: 'a stronger transaction history',
    weeks: 8,
  },
  small_farm: {
    action_sw: 'Fikiria kukodisha ardhi zaidi msimu ujao',
    action_en: 'Consider leasing additional land next season',
    outcome_sw: 'kipato kikubwa zaidi na kiwango cha juu',
    outcome_en: 'higher income and a better tier',
    weeks: 16,
  },
};

/* ── component ──────────────────────────────────────────────── */
interface EvidencePanelProps {
  farmer: Farmer | null;
  onClose: () => void;
}

export function EvidencePanel({ farmer, onClose }: EvidencePanelProps) {
  const [detail, setDetail] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    if (!farmer?.phoneHash) return;
    setLoading(true);
    setError('');
    api.farmerDetail(farmer.phoneHash)
      .then(data => setDetail(data as Farmer))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [farmer?.phoneHash]);

  const latestAssessment: Assessment | undefined = detail?.assessmentHistory?.[0];

  const handleMpesaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const result = await api.uploadFile(file);
      setUploadMsg(`Uploaded: ${result.filename}`);
      if (farmer?.phoneHash) {
        const updated = await api.farmerDetail(farmer.phoneHash);
        setDetail(updated as Farmer);
      }
    } catch (err: any) {
      setUploadMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const tierExplanations: Record<number, { name: string; range: string; meaning: string }> = {
    1: { name: 'Gold', range: '75–100', meaning: 'Approved for max loan' },
    2: { name: 'Silver', range: '60–74', meaning: 'Approved, need 75 for Gold' },
    3: { name: 'Bronze', range: '45–59', meaning: 'Conditional, need 60 for Silver' },
    4: { name: 'Referral', range: '0–44', meaning: 'Manual review needed' },
  };

  const currentTierInfo = latestAssessment ? tierExplanations[latestAssessment.tier] : null;

  return (
    <AnimatePresence>
      {farmer && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-gray-900 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              {/* header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Farmer Detail</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loading && <p className="text-gray-400">Loading…</p>}
              {error && <p className="text-red-400">{error}</p>}

              {detail && (
                <>
                  {/* Basic info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white font-mono text-lg">
                        {detail.phoneHash.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-mono text-sm">
                          {detail.phoneHash.slice(0, 12)}…
                        </p>
                        <p className="text-gray-400 text-xs">Hash ID</p>
                      </div>
                    </div>
                  </div>

                  {/* Location / Crop / Community / Date */}
                  <div className="flex flex-wrap gap-4 mb-6 text-gray-300 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" /> {detail.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wheat className="h-4 w-4 text-gray-500" /> {getCropDisplay(detail.cropType)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Network className="h-4 w-4 text-gray-500" /> {detail.communityTies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {new Date(detail.lastScoredAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Tier badge with explanation */}
                  <div className="mb-6 flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      detail.currentTier === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      detail.currentTier === 2 ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      Tier {detail.currentTier}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Score: {detail.currentScore ?? '—'}
                    </span>
                  </div>

                  {/* Latest Assessment */}
                  {latestAssessment && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Latest Assessment
                      </h4>

                      {/* Tier detail box */}
                      {currentTierInfo && (
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold text-white">{currentTierInfo.name}</span> tier
                              (score range {currentTierInfo.range})
                            </p>
                            <p className="text-xs text-gray-500 italic">
                              {latestAssessment.ptsToNextTier > 0
                                ? `${latestAssessment.ptsToNextTier} pts to next tier`
                                : 'Max tier reached'}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{currentTierInfo.meaning}</p>
                        </div>
                      )}

                      {/* Answers */}
{/* Answers */}
<div className="mb-4">
  <p className="text-sm font-medium text-gray-300 mb-2">Answers</p>
  {latestAssessment.answers ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
      {Object.entries(latestAssessment.answers).map(([key, val]) => (
        <div key={key} className="flex justify-between text-gray-400">
          <span className="text-gray-500">{formatFieldName(key)}:</span>
          <span>
            {key === 'cropType'
              ? getCropDisplay(val)
              : safeValue(val)}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-xs text-gray-500">No answers recorded.</p>
  )}
</div>

{/* Evidence */}
<div className="mb-4">
  <p className="text-sm font-medium text-gray-300 mb-2">Evidence</p>
  {latestAssessment.evidence ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
      {Object.entries(latestAssessment.evidence).map(([key, val]) => (
        <div key={key} className="flex justify-between text-gray-400">
          <span className="text-gray-500">{formatFieldName(key)}:</span>
          <span>{safeValue(val)}</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-xs text-gray-500">No evidence recorded.</p>
  )}
</div>


                      {/* ── Farmer Guidance (always visible) ──────────────────────── */}
<div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
    <AlertCircle className="h-4 w-4 text-amber-400" />
    Farmer Guidance
  </h4>

  {/* Tier explanation */}
  <div className="mb-4">
    <details className="group">
      <summary className="cursor-pointer text-sm text-gray-400 hover:text-white list-none flex items-center gap-1">
        <span>How tiers are calculated</span>
        <span className="text-xs ml-1 transition-transform group-open:rotate-90">▶</span>
      </summary>
      <div className="mt-2 text-xs text-gray-400 space-y-1 pl-2 border-l border-gray-700">
        <p>Your assessment score (0–100) is built from:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Farm stability (20 pts)</li>
          <li>Crop value & assets (10 pts)</li>
          <li>Community ties (30 pts) – the most important</li>
          <li>Loan history (20 pts)</li>
          <li>M‑Pesa cashflow (25 pts)</li>
          <li>Weather risk & graph signals (±10/‑15 pts)</li>
        </ul>
        <p className="mt-1">Tiers: Gold (75+), Silver (60–74), Bronze (45–59), Referral (0–44).</p>
      </div>
    </details>
  </div>

  {/* Current tier summary */}
  <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
  <p className="text-xs text-gray-400">
    Farmer is in <span className="font-semibold text-white">{currentTierInfo?.name}</span> tier
    {currentTierInfo ? ` (score range ${currentTierInfo.range})` : ''}.
  </p>
  {latestAssessment && latestAssessment.ptsToNextTier !== undefined ? (
    latestAssessment.ptsToNextTier > 0 ? (
      <p className="text-xs text-gray-400 mt-1">
        Needs <span className="font-semibold text-white">{latestAssessment.ptsToNextTier}</span> more points to reach the next tier.
      </p>
    ) : (
      <p className="text-xs text-gray-400 mt-1">Already at the highest tier.</p>
    )
  ) : (
    <p className="text-xs text-gray-500 mt-1 italic">Score progression details not available.</p>
  )}
</div>

  {/* Actionable steps */}
  {latestAssessment?.gaps && latestAssessment.gaps.length > 0 ? (
    <div>
      <p className="text-xs text-gray-400 mb-3">
        These steps address the farmer’s specific gaps. Share them with her.
      </p>
      <div className="space-y-4">
        {latestAssessment.gaps.map((gap, idx) => {
          const action = GAP_ACTIONS[gap];
          if (!action) return null;
          return (
            <div key={gap} className="border border-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Step {idx + 1}</p>
              <p className="text-sm text-white font-medium">
                {action.action_sw}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                ({action.action_en})
              </p>
              <p className="text-xs text-emerald-400 mt-2">
                <span className="text-gray-500">Unlocks: </span>
                {action.outcome_sw} ({action.outcome_en})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended return: {action.weeks} weeks
              </p>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>
      <p className="text-xs text-gray-400">
        No specific gaps identified. The best next step is to maintain good standing:
      </p>
      <ul className="mt-2 space-y-1 text-xs text-gray-400 list-disc list-inside ml-2">
        <li>Continue repaying loans on time</li>
        <li>Stay active in community groups</li>
        <li>Use M‑Pesa regularly for farming transactions</li>
        <li>Re‑assess in 12 weeks to capture any new evidence</li>
      </ul>
    </div>
  )}
</div>



                      {/* M‑Pesa Upload (if consent = true) */}
                      {latestAssessment.answers?.consentGiven === true && (
                        <div className="mb-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-emerald-400" />
                            <p className="text-sm font-medium text-white">Upload M‑Pesa Statement (PDF)</p>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            Farmer has given consent. Upload a PDF of her M‑Pesa statement for richer evidence.
                          </p>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                              <Upload className="h-4 w-4" />
                              Choose PDF
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleMpesaUpload}
                                disabled={uploading}
                              />
                            </label>
                            {uploading && <span className="text-gray-400 text-sm">Uploading…</span>}
                          </div>
                          {uploadMsg && (
                            <p className={`text-xs mt-2 ${uploadMsg.startsWith('Uploaded') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {uploadMsg}
                            </p>
                          )}
{detail.evidenceVerification?.mpesaStatement?.uploaded && (
  <p className="text-xs text-emerald-400 mt-2">
    Current statement: {detail.evidenceVerification?.mpesaStatement?.filename}
  </p>
)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* History */}
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
                              {assessment.gaps.length > 0 && (
                                <p className="text-red-400 text-xs">{assessment.gaps.length} gaps</p>
                              )}
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