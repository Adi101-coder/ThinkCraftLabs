import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * OrangeToWhiteTransition Component
 * Creates seamless theme transition from orange TextReveal to white background
 * Uses GSAP ScrollTrigger for perfect color interpolation and smooth blending
 */
export default function OrangeToWhiteTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🎨 OrangeToWhiteTransition: Component mounted');

    // Initialize body with orange background
    document.body.style.backgroundColor = '#FF5D05';
    document.body.style.color = 'white';

    const initTransition = () => {
      const container = containerRef.current;
      const textRevealSection = document.querySelector('#text-reveal');

      if (!container || !textRevealSection) {
        console.warn('⚠️ Container or TextReveal section not found, retrying...');
        return null;
      }

      console.log('✅ Container and TextReveal section found');

      // Create seamless color transition triggered when highlight reaches "that drive business success and"
      const scrollTrigger = ScrollTrigger.create({
        trigger: textRevealSection,
        start: 'top+=90% bottom',       // Start when highlight reaches ~90% through text ("that drive business success and")
        end: 'bottom top',              // Complete when text-reveal exits viewport
        scrub: 0.05,                    // Fast scrubbing for immediate response
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Only log significant progress changes
          if (progress === 0 || progress === 1 || Math.abs(progress - 0.5) < 0.01) {
            console.log(`🔄 Orange→White Progress: ${(progress * 100).toFixed(1)}%`);
          }

          // Start transition immediately when trigger point is reached
          const clampedProgress = Math.max(0, Math.min(1, progress));

          // Perfect color interpolation from orange to white
          const backgroundColor = gsap.utils.interpolate(
            '#FF5D05',        // Orange start
            '#ffffff',        // White end
            clampedProgress
          );

          const textColor = gsap.utils.interpolate(
            'rgb(255, 255, 255)', // White text on orange
            'rgb(31, 41, 55)',    // Dark text on white
            clampedProgress
          );

          // Apply colors with GPU acceleration
          gsap.set(document.body, {
            backgroundColor: backgroundColor,
            color: textColor,
            force3D: true
          });

          // Apply to container as well
          gsap.set(container, {
            backgroundColor: backgroundColor,
            color: textColor,
            force3D: true
          });

          // Update CSS variables for theme synchronization
          document.documentElement.style.setProperty('--transition-bg', backgroundColor);
          document.documentElement.style.setProperty('--transition-text', textColor);
          document.documentElement.style.setProperty('--orange-white-progress', clampedProgress.toString());
        },
        onEnter: () => console.log('🚀 Orange→White transition started - highlight reached "that drive business success and"'),
        onLeave: () => console.log('✨ Orange→White transition completed - White theme active'),
        onEnterBack: () => console.log('🔄 Reversing Orange→White transition'),
        onLeaveBack: () => console.log('🔙 Back to orange theme - before "that drive business success and"')
      });

      console.log('✅ Orange→White ScrollTrigger created successfully');
      return scrollTrigger;
    };

    // Initialize with retry mechanism
    let retryCount = 0;
    const maxRetries = 5;

    const tryInit = () => {
      const trigger = initTransition();

      if (!trigger && retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${maxRetries} in 500ms...`);
        setTimeout(tryInit, 500);
      } else if (trigger) {
        console.log('🎉 Orange→White transition initialized successfully!');
        (window as any).__orangeWhiteTransitionTrigger = trigger;
      } else {
        console.error('❌ Failed to initialize Orange→White transition after all retries');
      }
    };

    const timer = setTimeout(tryInit, 300);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.log('🧹 Cleaning up OrangeToWhiteTransition');

      if ((window as any).__orangeWhiteTransitionTrigger) {
        (window as any).__orangeWhiteTransitionTrigger.kill();
        delete (window as any).__orangeWhiteTransitionTrigger;
      }

      // Reset styles
      document.body.style.backgroundColor = '';
      document.body.style.color = '';

      if (containerRef.current) {
        containerRef.current.style.backgroundColor = '';
        containerRef.current.style.color = '';
      }

      document.documentElement.style.removeProperty('--transition-bg');
      document.documentElement.style.removeProperty('--transition-text');
      document.documentElement.style.removeProperty('--orange-white-progress');

      console.log('✅ Orange→White cleanup completed');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundColor: 'transparent', // Let the body background show through
        color: 'inherit' // Inherit text color from body
      }}
    >
      {/* Transition content with words */}
      <div className="max-w-7xl mx-auto px-4 w-full z-10 relative">
        <div className="text-center">
          {/* Main words display with subtle animations */}
          <div className="space-y-4">
            {['CREATIVE', 'BOLD', 'DYNAMIC'].map((word, index) => (
              <div
                key={word}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider transition-all duration-1000"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0.9,
                  transform: 'translateY(0)',
                  color: 'inherit' // Inherit from body
                }}
              >
                {word}
              </div>
            ))}
          </div>

          {/* Separator line */}
          <div className="mt-8 flex justify-center">
            <div
              className="h-0.5 transition-all duration-1000"
              style={{
                width: '60%',
                opacity: 0.8,
                backgroundColor: 'currentColor' // Use current text color
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%)',
          opacity: 0.2
        }}
      />
    </div>
  );
}