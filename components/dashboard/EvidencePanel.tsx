// src/components/dashboard/EvidencePanel.tsx
'use client';
import { useEffect, useState } from 'react';
import { api, Farmer, EvidenceRecord, Chama } from '@/lib/api';
import { TierBadge } from './TierBadge';

interface Props {
  farmer: Farmer | null;
  onClose: () => void;
}

const LAND_TYPES = ['Title Deed', 'Lease Agreement', 'Family Land'];

export function EvidencePanel({ farmer, onClose }: Props) {
  const [evidence, setEvidence]   = useState<EvidenceRecord | null>(null);
  const [chamas, setChamas]       = useState<Chama[]>([]);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // field name being uploaded

  // Form state
  const [chamaId, setChamaId]         = useState('');
  const [landType, setLandType]       = useState('');
  const [notes, setNotes]             = useState('');
  const [mpesaFile, setMpesaFile]     = useState('');
  const [landFile, setLandFile]       = useState('');
  const [chamaVerified, setChamaVerified]     = useState(false);
  const [coopVerified, setCoopVerified]       = useState(false);
  const [leaderConfirmed, setLeaderConfirmed] = useState(false);

  useEffect(() => {
    if (!farmer) return;
    setSaved(false);

    // Load evidence and chamas in parallel
    Promise.all([
      api.evidence(farmer.phoneHash),
      api.chamas(farmer.location ? capitalise(farmer.location) : undefined),
    ]).then(([ev, ch]) => {
      setEvidence(ev);
      setChamas(ch);

      // Pre-fill form from saved evidence
      setChamaId(ev.chama.id || '');
      setLandType(ev.land.type || '');
      setNotes(ev.notes || '');
      setMpesaFile(ev.mpesaStatement.filename || '');
      setLandFile(ev.land.filename || '');
      setChamaVerified(ev.communityVerification.chamaMembershipVerified);
      setCoopVerified(ev.communityVerification.cooperativeMemberVerified);
      setLeaderConfirmed(ev.communityVerification.womensGroupLeaderConfirmed);
    }).catch(() => {});
  }, [farmer]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'mpesa' | 'land') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const { filename } = await api.uploadFile(file);
      if (field === 'mpesa') setMpesaFile(filename);
      else setLandFile(filename);
    } catch {
      alert('Upload failed. Check your backend is running.');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    if (!farmer) return;
    setSaving(true);
    try {
      await api.saveEvidence(farmer.phoneHash, {
        mpesaStatement:             mpesaFile || undefined,
        chama:                      chamaId   || undefined,
        landType:                   landType  || undefined,
        landDocument:               landFile  || undefined,
        chamaMembershipVerified:    chamaVerified,
        cooperativeMemberVerified:  coopVerified,
        womensGroupLeaderConfirmed: leaderConfirmed,
        notes,
        verifiedBy: 'field_officer', // replace with actual officer ID when auth is wired
      });
      setSaved(true);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!farmer) return null;

  const CROP_LABELS: Record<string, string> = {
    crops: 'Maize / Beans', dairy: 'Dairy', horticulture: 'Horticulture', mixed: 'Mixed',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-xl bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-mono">{farmer.phoneHash.slice(0, 16)}…</p>
            <div className="flex items-center gap-2 mt-1">
              <TierBadge tier={farmer.currentTier} />
              <span className="text-white font-semibold">{farmer.currentScore ?? '—'}/100</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Farmer summary */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Location',  value: capitalise(farmer.location) },
              { label: 'Crop',      value: CROP_LABELS[farmer.cropType] || farmer.cropType },
              { label: 'Community', value: capitalise(farmer.communityTies || 'None') },
              { label: 'Land',      value: capitalise(farmer.farmAccess || '—') },
              { label: 'Assessments', value: String(farmer.assessmentCount) },
              { label: 'Last scored', value: farmer.lastScoredAt ? new Date(farmer.lastScoredAt).toLocaleDateString('en-KE') : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-900 rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm text-white font-medium mt-0.5 capitalize">{value}</p>
              </div>
            ))}
          </div>

          {/* Evidence verification form */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Evidence Verification
            </h3>

            <div className="space-y-5">
              {/* M-Pesa statement */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">M-Pesa Statement</label>
                {mpesaFile ? (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs">✓</span>
                    <span className="text-green-400 text-sm truncate">{mpesaFile}</span>
                    <button onClick={() => setMpesaFile('')} className="ml-auto text-gray-500 hover:text-red-400 text-xs">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg px-4 py-3 cursor-pointer hover:border-gray-600 transition-colors">
                    <span className="text-gray-400 text-sm">
                      {uploading === 'mpesa' ? 'Uploading…' : 'Choose file (PDF, JPG, PNG)'}
                    </span>
                    <input
                      type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                      onChange={e => handleUpload(e, 'mpesa')}
                      disabled={uploading !== null}
                    />
                  </label>
                )}
              </div>

              {/* Chama dropdown */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Registered Chama / Group</label>
                <select
                  value={chamaId} onChange={e => setChamaId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500"
                >
                  <option value="">— Select group —</option>
                  {chamas.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.subCounty})</option>
                  ))}
                </select>
              </div>

              {/* Land document */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Land Document</label>
                <div className="flex gap-2 mb-2">
                  {LAND_TYPES.map(lt => (
                    <button
                      key={lt}
                      onClick={() => setLandType(lt)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        landType === lt
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {lt}
                    </button>
                  ))}
                </div>
                {landFile ? (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs">✓</span>
                    <span className="text-green-400 text-sm truncate">{landFile}</span>
                    <button onClick={() => setLandFile('')} className="ml-auto text-gray-500 hover:text-red-400 text-xs">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg px-4 py-3 cursor-pointer hover:border-gray-600 transition-colors">
                    <span className="text-gray-400 text-sm">
                      {uploading === 'land' ? 'Uploading…' : 'Upload document'}
                    </span>
                    <input
                      type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                      onChange={e => handleUpload(e, 'land')}
                      disabled={uploading !== null}
                    />
                  </label>
                )}
              </div>

              {/* Community verification checkboxes */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Community Verification</label>
                <div className="space-y-2">
                  {[
                    { label: 'Chama membership verified', state: chamaVerified, set: setChamaVerified },
                    { label: 'Cooperative membership verified', state: coopVerified, set: setCoopVerified },
                    { label: "Women's group leader confirmed", state: leaderConfirmed, set: setLeaderConfirmed },
                  ].map(({ label, state, set }) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => set(!state)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          state ? 'bg-green-500 border-green-500' : 'border-gray-600 group-hover:border-gray-500'
                        }`}
                      >
                        {state && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Officer notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Field Officer Notes</label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Visited farmer at Karai farm. Chama chairlady confirmed membership."
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 resize-none placeholder-gray-600"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  saved
                    ? 'bg-green-600/20 border border-green-600/40 text-green-400'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                } disabled:opacity-50`}
              >
                {saving ? 'Saving…' : saved ? '✓ Evidence saved' : 'Save evidence'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function capitalise(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}