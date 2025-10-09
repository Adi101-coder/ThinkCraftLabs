import { useEffect, useRef, useState } from 'react';

interface StickyVideoSectionProps {
  src: string;
}

export default function StickyVideoSection({ src }: StickyVideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    
    /**
     * Calculate scroll progress through the section
     * Returns 0 at section start, 1 at section end
     */
    const calculateScrollProgress = (): number => {
      if (!sectionRef.current) return 0;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Start animation when section enters viewport
      const startOffset = viewportHeight;
      const endOffset = -sectionHeight;
      
      // Calculate progress (0 to 1)
      const totalDistance = startOffset - endOffset;
      const currentDistance = rect.top - endOffset;
      const progress = Math.max(0, Math.min(1, 1 - (currentDistance / totalDistance)));
      
      return progress;
    };

    /**
     * Smooth scroll handler using requestAnimationFrame
     * Throttles updates for optimal performance
     */
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const progress = calculateScrollProgress();
        setScrollProgress(progress);
        
        // Apply transforms directly for better performance
        updateVideoTransform(progress);
        updateDesktopTextOpacity(progress);
      });
    };

    /**
     * Update video scaling and positioning based on scroll progress
     * Interpolates between initial large centered state and final smaller top-right sticky position
     */
    const updateVideoTransform = (progress: number) => {
      if (!videoRef.current) return;
      
      // Scale: 1.0 → 0.45 (55% reduction for better final size)
      const scale = 1 - (progress * 0.55);
      
      // Position: center → top-right corner
      // On mobile: stays centered horizontally
      const isMobile = window.innerWidth < 768;
      const translateX = isMobile ? 0 : progress * 35; // Move right on desktop
      const translateY = progress * -25; // Move up
      
      videoRef.current.style.transform = `
        scale(${Math.max(scale, 0.45)}) 
        translate(${translateX}%, ${translateY}%)
      `;
      
      // Increase border radius as video shrinks
      const borderRadius = 16 + (progress * 20);
      videoRef.current.style.borderRadius = `${borderRadius}px`;
    };

    /**
     * Fade in desktop text blocks as video shrinks (desktop only)
     * Left text slides in from left, right text from right
     */
    const updateDesktopTextOpacity = (progress: number) => {
      if (!leftTextRef.current || !rightTextRef.current) return;
      
      // Only animate on desktop screens
      const isDesktop = window.innerWidth >= 768;
      if (!isDesktop) return;
      
      // Start fading in text when video is 50% shrunk
      const textProgress = Math.max(0, (progress - 0.3) / 0.7);
      const opacity = Math.min(textProgress * 1.5, 1);
      
      // Slide animation
      const slideDistance = 30;
      const leftTranslateX = -slideDistance + (textProgress * slideDistance);
      const rightTranslateX = slideDistance - (textProgress * slideDistance);
      
      leftTextRef.current.style.opacity = opacity.toString();
      leftTextRef.current.style.transform = `translateX(${leftTranslateX}px)`;
      
      rightTextRef.current.style.opacity = opacity.toString();
      rightTextRef.current.style.transform = `translateX(${rightTranslateX}px)`;
    };



    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[120vh] bg-background"
    >
      {/* Sticky container for video and text */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Video container - responsive positioning */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full max-w-6xl h-[85vh] object-cover shadow-2xl transition-all duration-100 ease-out"
            style={{
              transformOrigin: 'center center',
              borderRadius: '16px'
            }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Desktop floating text cards - visible only on large screens */}
        <div 
          ref={leftTextRef}
          className="hidden md:block absolute left-8 top-1/2 transform -translate-y-1/2 z-10 max-w-xs opacity-0"
          style={{ transition: 'opacity 0.3s ease-out, transform 0.3s ease-out' }}
        >
          <div className="bg-background/90 backdrop-blur-sm p-6 rounded-2xl border border-border/20 shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              01. Additive Manufacturing
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Layer-by-layer precision building complex geometries impossible with traditional methods.
            </p>
          </div>
        </div>

        <div 
          ref={rightTextRef}
          className="hidden md:block absolute right-8 bottom-12 z-10 max-w-xs opacity-0"
          style={{ transition: 'opacity 0.3s ease-out, transform 0.3s ease-out' }}
        >
          <div className="bg-background/90 backdrop-blur-sm p-6 rounded-2xl border border-border/20 shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              02. Rapid Prototyping
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              From concept to physical prototype in hours, accelerating innovation cycles.
            </p>
          </div>
        </div>

        {/* Mobile text stack - visible only on small screens */}
        <div className="md:hidden absolute bottom-4 left-4 right-4 space-y-4">
          <div 
            className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/20 opacity-0"
            style={{ 
              opacity: scrollProgress > 0.5 ? 1 : 0,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-2">01. Additive Manufacturing</h4>
            <p className="text-muted-foreground text-sm">
              Layer-by-layer precision building complex geometries.
            </p>
          </div>
          
          <div 
            className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/20 opacity-0"
            style={{ 
              opacity: scrollProgress > 0.6 ? 1 : 0,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-2">02. Rapid Prototyping</h4>
            <p className="text-muted-foreground text-sm">
              From concept to physical prototype in hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}