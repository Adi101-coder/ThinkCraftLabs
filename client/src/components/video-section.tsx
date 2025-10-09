import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !sectionRef.current) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    const leftContent = leftContentRef.current;
    const rightContent = rightContentRef.current;

    // Initial state - hide side content
    gsap.set([leftContent, rightContent], { 
      opacity: 0, 
      x: (index) => index === 0 ? -50 : 50 
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Video transformation
        if (video) {
          const scale = 1 - (progress * 0.3); // Shrink to 70% of original size
          const borderRadius = 24 + (progress * 16); // Increase border radius
          
          gsap.set(video, {
            scale: Math.max(scale, 0.7),
            borderRadius: `${Math.min(borderRadius, 40)}px`
          });
        }

        // Side content appearance
        if (leftContent && rightContent) {
          const contentOpacity = Math.min(progress * 2, 1);
          const contentX = progress * 50;
          
          gsap.set(leftContent, {
            opacity: contentOpacity,
            x: -50 + contentX
          });
          
          gsap.set(rightContent, {
            opacity: contentOpacity,
            x: 50 - contentX
          });
        }
      }
    });

    return () => {
      scrollTrigger?.kill();
    };
  }, [isLoaded, gsap, ScrollTrigger]);

  return (
    <section ref={sectionRef} className="py-32 bg-background min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Left Content */}
        <div 
          ref={leftContentRef}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 max-w-xs"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            01. Additive Manufacturing
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Layer-by-layer precision building complex geometries impossible with traditional methods.
          </p>
        </div>

        {/* Right Content */}
        <div 
          ref={rightContentRef}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 max-w-xs text-right"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            02. Rapid Prototyping
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            From concept to physical prototype in hours, accelerating innovation cycles.
          </p>
        </div>

        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-[80vh] object-cover rounded-3xl shadow-2xl mx-auto block"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}