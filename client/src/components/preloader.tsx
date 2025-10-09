import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { gsap, isLoaded } = useGSAP();
  const hasCompletedRef = useRef(false);

  const completePreloader = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsVisible(false);
    onComplete();
  };

  // Fallback: Always complete after 3.5 seconds, even if GSAP fails to load
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        completePreloader();
      }
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!isLoaded || !gsap || hasCompletedRef.current) return;

    const tl = gsap.timeline();

    // Animate preloader text
    tl.to(textRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animate loading bar
    tl.to(progressRef.current, {
      x: '100%',
      duration: 2,
      ease: "power2.inOut"
    });

    // Add a pause before transition
    tl.to({}, { duration: 0.5 });

    // Slide preloader up and fade out
    tl.to(preloaderRef.current, {
      y: '-100%',
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: completePreloader
    });

    return () => {
      tl.kill();
    };
  }, [isLoaded, gsap]);

  if (!isVisible) return null;

  return (
    <div 
      ref={preloaderRef}
      className="preloader"
      data-testid="preloader"
    >
      <div className="text-center">
        <h1 
          ref={textRef}
          className="text-6xl md:text-8xl font-bold text-white mb-4 opacity-0"
          data-testid="preloader-text"
        >
          ThinkCraft
        </h1>
        <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-white rounded-full transform -translate-x-full"
            data-testid="loading-progress"
          />
        </div>
      </div>
    </div>
  );
}
