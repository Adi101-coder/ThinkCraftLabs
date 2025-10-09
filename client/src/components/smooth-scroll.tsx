import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll Component
 * Simple wrapper that just ensures ScrollTrigger works properly
 * Uses native scrolling for best performance and natural feel
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('🚀 SmoothScroll: Using native scrolling with ScrollTrigger support');

    // Just refresh ScrollTrigger to ensure it works with native scrolling
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('✅ ScrollTrigger refreshed for native scrolling');
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.log('✅ SmoothScroll cleanup completed');
    };
  }, []);

  // Return children directly without any wrapper - native scrolling
  return <>{children}</>;
}