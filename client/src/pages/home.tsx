import { useState } from 'react';
import Preloader from '@/components/preloader';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import StickyVideoSection from '@/components/sticky-video-section';
import UnifiedThemeMorph from '@/components/unified-theme-morph';



import TextReveal from '@/components/text-reveal';
import TextToIndustryTransition from '@/components/text-to-industry-transition';
import AnimatedMarquee from '@/components/animated-marquee';


import Footer from '@/components/footer';
import ScrollProgress from '@/components/scroll-progress';
import ScrollIndicator from '@/components/scroll-indicator';


export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
  };



  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="home-page">
      <ScrollProgress />

      {!preloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {preloaderComplete && (
        <div className="main-content-enter">
          <Navigation />
          <HeroSection />

          <StickyVideoSection src="/video.mp4" />

          <UnifiedThemeMorph />

          <TextReveal />
          <TextToIndustryTransition />
          <AnimatedMarquee />
          <Footer />
        </div>
      )}
    </div>
  );
}
