'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  MapPin,
  Lock,
  X,
  Users,
  Building,
  ShoppingBag,
  MessageSquare,
  CheckCircle,
  XCircle,
  Network,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOrganisationRecords, type OrganisationRecord } from '@/hooks/use-shamb-data';

const outcomeColors: Record<string, string> = {
  Approved: 'bg-emerald-500/90 text-white',
  'Conditional Approval': 'bg-blue-500/90 text-white',
  'Referred for Manual Review': 'bg-amber-500/90 text-gray-900',
};

function RecordDrawer({
  record,
  onClose,
}: {
  record: OrganisationRecord;
  onClose: () => void;
}) {
  const { evidenceProfile } = record;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-2xl bg-gray-900 shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-950/30 px-3 py-1">
              <Lock className="h-3 w-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Internal Use Only</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-800 p-2 hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-xl font-bold text-white">
              {record.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{record.name}</h3>
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                {record.location}
              </p>
            </div>
          </div>

          {/* Scores */}
          <div className="mt-4 grid grid-cols-4 gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{record.baseAssessment}</p>
              <p className="text-xs text-gray-500">Base Score</p>
            </div>
            <div className="text-center border-l border-gray-700">
              <p className="text-2xl font-bold text-emerald-400">+{record.adjustment}</p>
              <p className="text-xs text-gray-500">Evidence Lift</p>
            </div>
            <div className="text-center border-l border-gray-700">
              <p className="text-2xl font-bold text-white">{record.finalAssessment}</p>
              <p className="text-xs text-gray-500">Final Score</p>
            </div>
            <div className="flex items-center justify-center border-l border-gray-700">
              <Badge className={outcomeColors[record.finalOutcome] || 'bg-gray-700 text-gray-300'}>
                {record.finalOutcome.includes('Approved') ? 'Approved' : 'Referred'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="p-6">
            {/* Evidence Profile */}
            <div className="mb-8">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Users className="h-5 w-5 text-emerald-400" />
                Evidence Profile
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Cooperatives */}
                <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">Cooperatives</span>
                  </div>
                  {evidenceProfile.cooperatives.length > 0 ? (
                    <ul className="space-y-1">
                      {evidenceProfile.cooperatives.map((coop: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-200">
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                          <span>{coop}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <XCircle className="h-3 w-3" />
                      None found
                    </p>
                  )}
                </div>

                {/* Buyers */}
                <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">Buyers</span>
                  </div>
                  {evidenceProfile.buyers.length > 0 ? (
                    <ul className="space-y-1">
                      {evidenceProfile.buyers.map((buyer: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-200">
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                          <span>{buyer}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <XCircle className="h-3 w-3" />
                      None found
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Graph Signals Found */}
            <div className="mb-8">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Network className="h-5 w-5 text-emerald-400" />
                Relationship Evidence Discovered
              </h4>
              {evidenceProfile.graphSignalsFound.length > 0 ? (
                <ul className="space-y-2">
                  {evidenceProfile.graphSignalsFound.map((signal: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-lg border border-emerald-800/30 bg-emerald-950/20 p-3"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-gray-200">{signal}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No relationship evidence discovered.</p>
              )}
            </div>

            {/* Internal Explanation */}
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold text-white">Internal Explanation</h4>

              <div className="mb-4 rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                <h5 className="mb-2 font-medium text-red-300">Traditional Assessment Factors</h5>
                <ul className="space-y-1">
                  {evidenceProfile.baseReasons.map((reason: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-red-200">
                      <XCircle className="h-3 w-3 text-red-400" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20 p-4">
                <h5 className="mb-2 font-medium text-emerald-300">Relationship Evidence Discovered</h5>
                {evidenceProfile.evidenceReasons.length > 0 ? (
                  <ul className="space-y-1">
                    {evidenceProfile.evidenceReasons.map((reason: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-emerald-200">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No evidence found</p>
                )}
              </div>

              <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">
                <p className="text-gray-300">{evidenceProfile.internalExplanation}</p>
              </div>
            </div>

            {/* Final Outcome */}
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold text-white">Final Outcome</h4>
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Assessment Result</p>
                    <p className="text-lg font-bold text-white">{record.finalOutcome}</p>
                  </div>
                  <Badge className={`text-base px-4 py-2 ${outcomeColors[record.finalOutcome] || ''}`}>
                    {record.finalAssessment}/100
                  </Badge>
                </div>
              </div>
            </div>

            {/* SMS Sent */}
            <div className="mb-6">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                SMS Sent To Farmer
              </h4>
              <div className="rounded-xl border border-gray-700 bg-gray-800/80 p-4">
                <p className="leading-relaxed text-gray-200">{record.smsSent}</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 border-t border-gray-800 pt-4 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last assessment: {evidenceProfile.lastAssessmentDate}</span>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}

function TableRowComponent({
  record,
  onClick,
}: {
  record: OrganisationRecord;
  onClick: () => void;
}) {
  return (
    <TableRow onClick={onClick} className="cursor-pointer hover:bg-gray-800/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 text-sm font-bold text-white">
            {record.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-white">{record.name}</p>
            <p className="text-xs text-gray-400">{record.location}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`text-lg font-semibold ${
            record.baseAssessment < 40
              ? 'text-red-400'
              : record.baseAssessment < 60
              ? 'text-amber-400'
              : 'text-gray-400'
          }`}
        >
          {record.baseAssessment}
        </span>
      </TableCell>
      <TableCell>
        <p
          className={
            record.evidenceFound === 'None discovered'
              ? 'text-gray-500'
              : 'text-emerald-400 font-medium'
          }
        >
          {record.evidenceFound}
        </p>
      </TableCell>
      <TableCell>
        <span
          className={`text-lg font-semibold ${
            record.adjustment > 0 ? 'text-emerald-400' : 'text-gray-500'
          }`}
        >
          {record.adjustment > 0 ? `+${record.adjustment}` : '-'}
        </span>
      </TableCell>
      <TableCell>
        <Badge className={outcomeColors[record.finalOutcome] || 'bg-gray-700 text-gray-300'}>
          {record.finalOutcome.includes('Approved') ? record.finalOutcome : 'Referred'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
      </TableCell>
    </TableRow>
  );
}

export function OrganisationViewSection() {
  const { data: records, isLoading, error } = useOrganisationRecords();
  const [selectedRecord, setSelectedRecord] = useState<OrganisationRecord | null>(null);

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Organisation View</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Assessment Records</h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            Technical view for partner organisations. Click any row to see the full evidence profile.
          </p>
        </motion.div>

        {/* Table */}
        {isLoading ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-gray-800" />
                  <div className="h-4 flex-1 rounded bg-gray-800" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            Unable to load records.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-sm"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800 hover:bg-gray-800">
                  <TableHead className="font-semibold text-gray-300">Farmer</TableHead>
                  <TableHead className="font-semibold text-gray-300">Base Score</TableHead>
                  <TableHead className="font-semibold text-gray-300">Evidence Found</TableHead>
                  <TableHead className="font-semibold text-gray-300">Adjustment</TableHead>
                  <TableHead className="font-semibold text-gray-300">Outcome</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {records?.map((record: OrganisationRecord) => (
                  <TableRowComponent
                    key={record.id}
                    record={record}
                    onClick={() => setSelectedRecord(record)}
                  />
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center gap-2 text-sm text-gray-500"
        >
          <Lock className="h-4 w-4" />
          <span>Internal data visible only to partner organisations.</span>
        </motion.div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedRecord && (
          <RecordDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}