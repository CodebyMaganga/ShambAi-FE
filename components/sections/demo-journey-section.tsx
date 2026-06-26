'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle, MessageSquare } from 'lucide-react';
import { useFarmerProfiles, type FarmerProfile } from '@/hooks/use-shamb-data';

interface DemoStep {
  id: string;
  label: string;
  description: string;
}

const demoSteps: DemoStep[] = [
  { id: 'start', label: 'Start', description: 'Mary begins her assessment' },
  { id: 'traditional', label: 'Traditional View', description: 'Traditional system sees missing data' },
  { id: 'discovery', label: 'Relationship Discovery', description: 'ShambAI searches for connections' },
  { id: 'evidence', label: 'Evidence Found', description: 'Cooperative, buyer, and community signals' },
  { id: 'assessment', label: 'Assessment Complete', description: 'Final score with evidence lift' },
  { id: 'sms', label: 'SMS Received', description: 'Mary receives her outcome' },
];

export function DemoJourneySection() {
  const { data: farmers } = useFarmerProfiles();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const mary = farmers?.find((f: FarmerProfile) => f.id === 'farmer-mary');

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStartDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <section className="w-full bg-gray-950 py-20">
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Demo Journey</h2>
          <p className="text-lg text-gray-300">
            Watch Mary&apos;s assessment journey from start to finish.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-8 flex justify-center gap-4">
          {!isPlaying && currentStep === 0 && (
            <button onClick={handleStartDemo} className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
              <Play className="mr-2 h-5 w-5" />
              Run Demo Journey
            </button>
          )}
          {isPlaying && (
            <button onClick={handlePause} className="inline-flex items-center justify-center px-6 py-3 border border-gray-400 hover:border-white text-gray-200 hover:text-white font-medium rounded-lg transition-colors">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </button>
          )}
          {!isPlaying && currentStep > 0 && (
            <>
              <button onClick={handleStartDemo} className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                <Play className="mr-2 h-5 w-5" />
                Resume
              </button>
              <button onClick={handleReset} className="inline-flex items-center justify-center px-6 py-3 border border-gray-400 hover:border-white text-gray-200 hover:text-white font-medium rounded-lg transition-colors">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </button>
            </>
          )}
        </div>

        {/* Steps indicator */}
        <div className="mb-8 flex items-center justify-between">
          {demoSteps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: index <= currentStep ? 1 : 0.8,
                    backgroundColor: index <= currentStep ? '#10b981' : '#374151', // emerald-500 / gray-700
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <p className="mt-2 text-xs font-medium text-gray-400">{step.label}</p>
              </div>
              {index < demoSteps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    index < currentStep ? 'bg-emerald-500/60' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm"
          >
            <h3 className="font-serif text-2xl font-semibold text-white">
              {demoSteps[currentStep]?.label}
            </h3>
            <p className="mt-2 text-gray-300">{demoSteps[currentStep]?.description}</p>

            {/* Step-specific content */}
            {currentStep === 1 && mary && (
              <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/30 p-4">
                <p className="text-sm font-medium text-red-400">Traditional Assessment</p>
                <p className="mt-2 text-red-200">{mary.traditionalOutcome}</p>
              </div>
            )}

            {currentStep === 3 && mary && (
              <ul className="mt-6 space-y-2">
                {mary.evidenceFound.map((evidence: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-200">{evidence}</span>
                  </motion.li>
                ))}
              </ul>
            )}

            {currentStep === 4 && mary && (
              <div className="mt-6 grid grid-cols-4 gap-4 rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-400">42</p>
                  <p className="text-xs text-gray-500">Base Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">+38</p>
                  <p className="text-xs text-gray-500">Evidence Lift</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">80</p>
                  <p className="text-xs text-gray-500">Final Score</p>
                </div>
                <div className="text-center">
                  <span className="inline-block rounded-full bg-emerald-500/90 px-3 py-1 text-sm font-medium text-white">
                    Approved
                  </span>
                </div>
              </div>
            )}

            {currentStep === 5 && mary && (
              <div className="mt-6 rounded-xl border border-gray-700/50 bg-gray-800/80 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">SMS Received</span>
                </div>
                <p className="text-gray-200 leading-relaxed">{mary.smsReceived}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}