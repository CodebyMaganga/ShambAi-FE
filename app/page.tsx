'use client';

import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/sections/hero-section';
import { MaryStorySection } from '@/components/sections/mary-story-section';
import { EvidenceDiscoverySection } from '@/components/sections/evidence-discovery-section';
import { ThreeFarmersSection } from '@/components/sections/three-farmers-section';
import { RelationshipEvidenceSection } from '@/components/sections/relationship-evidence-section';
import { ImpactSection } from '@/components/sections/impact-section';
import { DemoJourneySection } from '@/components/sections/demo-journey-section';
import { OrganisationViewSection } from '@/components/sections/organisation-view-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

const queryClient = new QueryClient();

export default function ShambAIDashboard() {
  const maryStoryRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToMaryStory = () => {
    maryStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <main className="relative">
                   <Header transparent />
              {/* SECTION 1 - Hero */}
              <HeroSection onSeeMaryStory={scrollToMaryStory} onRunDemo={scrollToDemo} />

              {/* SECTION 2 - Mary's Story */}
              <div ref={maryStoryRef}>
                <MaryStorySection />
              </div>

              {/* SECTION 3 - What We Found */}
              <EvidenceDiscoverySection />

              {/* SECTION 4 - Three Farmers */}
              <ThreeFarmersSection />

              {/* SECTION 5 - How Relationship Evidence Works */}
              <RelationshipEvidenceSection />

              {/* SECTION 6 - Impact */}
              <ImpactSection />

              {/* SECTION 7 - Demo Journey */}
              <div ref={demoRef}>
                <DemoJourneySection />
              </div>

              {/* SECTION 8 - Organisation View */}
              <OrganisationViewSection />

              {/* Footer */}
              <Footer />
            </main>
          </motion.div>
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}
