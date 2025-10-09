import React, { useEffect, useRef, useState, useCallback } from 'react';

// Type definitions
type Panel = {
  id: string;
  mediaType: 'image' | 'video';
  src: string;
  poster?: string;
  caption?: string;
  alt?: string;
};

type ThreePanelShowcaseProps = {
  panels: [Panel, Panel, Panel];
  sectionHeightVH?: number;
  cardRadiusPx?: number;
  hoverTiltStrength?: number;
  enableCenterSticky?: boolean;
  className?: string;
};

// Individual card component with hover tilt effect
const ShowcaseCard: React.FC<{
  panel: Panel;
  index: number;
  cardRadiusPx: number;
  hoverTiltStrength: number;
  isVisible: boolean;
}> = ({ panel, index, cardRadiusPx, hoverTiltStrength, isVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const targetTilt = useRef({ x: 0, y: 0 });

  /**
   * Smooth tilt animation using requestAnimationFrame
   * Applies damping for natural motion
   */
  const animateTilt = useCallback(() => {
    setTilt(current => {
      const dampingFactor = 0.1;
      const newX = current.x + (targetTilt.current.x - current.x) * dampingFactor;
      const newY = current.y + (targetTilt.current.y - current.y) * dampingFactor;
      
      // Continue animation if not close enough to target
      if (Math.abs(newX - targetTilt.current.x) > 0.1 || Math.abs(newY - targetTilt.current.y) > 0.1) {
        animationFrameRef.current = requestAnimationFrame(animateTilt);
      }
      
      return { x: newX, y: newY };
    });
  }, []);

  /**
   * Calculate tilt based on mouse position
   * Maps pointer position to rotation values
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply tilt strength
    targetTilt.current = {
      x: relativeY * hoverTiltStrength * -1, // Invert Y for natural tilt
      y: relativeX * hoverTiltStrength
    };
    
    // Start animation
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateTilt);
    }
  }, [hoverTiltStrength, animateTilt]);

  /**
   * Reset tilt on mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateTilt);
    }
  }, [animateTilt]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      role="group"
      aria-label={`Showcase panel ${index + 1}: ${panel.caption || panel.alt || 'Media content'}`}
      tabIndex={0}
      className={`
        showcase-card relative overflow-hidden cursor-pointer
        transition-all duration-700 ease-[cubic-bezier(.2,.9,.2,1)]
        will-change-transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
      style={{
        borderRadius: `${cardRadiusPx}px`,
        transform: `
          perspective(1000px) 
          rotateX(${tilt.x}deg) 
          rotateY(${tilt.y}deg) 
          translateZ(0)
        `,
        transitionDelay: `${index * 100}ms`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media content */}
      {panel.mediaType === 'image' ? (
        <img
          src={panel.src}
          alt={panel.alt || panel.caption || 'Showcase image'}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ borderRadius: `${cardRadiusPx}px` }}
        />
      ) : (
        <video
          src={panel.src}
          poster={panel.poster}
          className="w-full h-full object-cover"
          style={{ borderRadius: `${cardRadiusPx}px` }}
          autoPlay
          loop
          muted
          playsInline
        >
          {panel.caption && (
            <track kind="captions" src="" label="English" />
          )}
        </video>
      )}
      
      {/* Caption overlay */}
      {panel.caption && (
        <div className="absolute bottom-6 left-6 z-10">
          <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
            {panel.caption}
          </h3>
        </div>
      )}
      
      {/* Subtle gradient overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
        style={{ borderRadius: `${cardRadiusPx}px` }}
      />
    </div>
  );
};

/**
 * ThreePanelShowcase Component
 * Displays a grid of media cards with smooth hover effects and scroll animations
 */
export const ThreePanelShowcase: React.FC<ThreePanelShowcaseProps> = ({
  panels,
  sectionHeightVH = 100,
  cardRadiusPx = 28,
  hoverTiltStrength = 12,
  enableCenterSticky = false,
  className = ''
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /**
   * Intersection Observer for scroll reveal animation
   * Triggers when section enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /**
   * Optional center card sticky effect based on scroll progress
   */
  useEffect(() => {
    if (!enableCenterSticky) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableCenterSticky]);

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 bg-background ${className}`}
      style={{ minHeight: `${sectionHeightVH}vh` }}
      aria-label="Three panel showcase"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-[70vh] md:h-[60vh]">
          {panels.map((panel, index) => (
            <ShowcaseCard
              key={panel.id}
              panel={panel}
              index={index}
              cardRadiusPx={cardRadiusPx}
              hoverTiltStrength={hoverTiltStrength}
              isVisible={isVisible}
            />
          ))}
        </div>
        
        {/* Optional center card emphasis effect */}
        {enableCenterSticky && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `scale(${1 + scrollProgress * 0.05})`,
              opacity: scrollProgress
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ThreePanelShowcase;