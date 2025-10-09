import React, { useEffect, useRef, useState, useCallback } from 'react';

// TypeScript interfaces for type safety and better developer experience
interface ShowcaseItem {
  id: string;
  title: string;
  body: string;
  meta: string;
  img: string;
}

interface ScrollTriggeredShowcaseProps {
  items: ShowcaseItem[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollTriggeredShowcase Component
 * 
 * Features:
 * - Fixed content with scroll-triggered animations
 * - Left side: Text items appear with smooth translate+fade animations
 * - Right side: Dynamic card updates based on active scroll section
 * - GPU-accelerated transforms for maximum performance
 * - Full TypeScript typing and accessibility support
 * - Responsive design (stacked on mobile)
 */
export default function ScrollTriggeredShowcase({ 
  items, 
  className = '',
  style = {}
}: ScrollTriggeredShowcaseProps) {
  // State management with TypeScript typing
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  // Refs for DOM manipulation and scroll handling
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll handler for smooth card sliding effect
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const containerRect = containerRef.current.getBoundingClientRect();
          const containerHeight = containerRef.current.offsetHeight;
          const viewportHeight = window.innerHeight;
          
          // Calculate precise scroll progress within the sticky container
          const scrollStart = -containerRect.top;
          const scrollEnd = containerHeight - viewportHeight;
          const progress = Math.max(0, Math.min(1, scrollStart / scrollEnd));
          
          setScrollProgress(progress);
          
          // Calculate active slide with smooth transitions between cards
          const exactIndex = progress * (items.length - 1);
          const slideIndex = Math.round(exactIndex);
          const clampedIndex = Math.max(0, Math.min(items.length - 1, slideIndex));
          
          if (clampedIndex !== activeIndex) {
            setActiveIndex(clampedIndex);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, items.length]);

  // Enhanced card animation state with smooth sliding transitions
  const getCardTransform = (index: number): { transform: string; opacity: number; zIndex: number } => {
    const diff = index - activeIndex;
    const progress = scrollProgress * (items.length - 1) - Math.floor(scrollProgress * (items.length - 1));
    
    if (diff === 0) {
      // Current active card
      return {
        transform: `translateY(0%) scale(1)`,
        opacity: 1,
        zIndex: 10
      };
    } else if (diff === 1) {
      // Next card sliding in from bottom
      const slideProgress = Math.max(0, progress);
      return {
        transform: `translateY(${100 - slideProgress * 100}%) scale(${0.9 + slideProgress * 0.1})`,
        opacity: slideProgress,
        zIndex: 5
      };
    } else if (diff === -1) {
      // Previous card sliding out to top
      const slideProgress = Math.max(0, progress);
      return {
        transform: `translateY(${-slideProgress * 100}%) scale(${1 - slideProgress * 0.1})`,
        opacity: 1 - slideProgress,
        zIndex: 1
      };
    } else if (diff > 1) {
      // Future cards waiting below
      return {
        transform: `translateY(100%) scale(0.9)`,
        opacity: 0,
        zIndex: 0
      };
    } else {
      // Past cards above viewport
      return {
        transform: `translateY(-100%) scale(0.9)`,
        opacity: 0,
        zIndex: 0
      };
    }
  };

  // Calculate text item animation state
  const getItemState = (index: number): 'hidden' | 'active' | 'exiting' => {
    if (index === activeIndex) return 'active';
    if (index < activeIndex) return 'exiting';
    return 'hidden';
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ 
        // Create scroll space for all slides
        height: `${items.length * 100}vh`,
        ...style
      }}
    >
      {/* Sticky content container - remains fixed while scrolling through slides */}
      <div 
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center z-10"
      >
        <div className="w-full max-w-7xl mx-auto px-4 h-full">
          
          {/* Enhanced responsive layout with improved spacing */}
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-16 lg:gap-24 px-4 lg:px-8">
            
            {/* Left side: Enhanced animated text section */}
            <div className="relative pointer-events-auto flex-1 max-w-3xl">
              {/* Background decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {items.map((item, index) => {
                const state = getItemState(index);
                
                return (
                  <div
                    key={item.id}
                    className={`
                      ${index === 0 ? 'relative' : 'absolute inset-0'}
                      flex flex-col justify-center
                      transform transition-all duration-700 ease-out
                      ${state === 'active' 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : state === 'exiting'
                        ? '-translate-y-16 opacity-0 scale-95'
                        : 'translate-y-16 opacity-0 scale-95'
                      }
                    `}
                    style={{
                      // GPU acceleration for smooth transforms
                      willChange: 'transform, opacity, scale',
                      // Only show active item to prevent overlap
                      pointerEvents: state === 'active' ? 'auto' : 'none',
                      // Staggered animation timing
                      transitionDelay: state === 'active' ? '100ms' : '0ms'
                    }}
                  >
                    {/* Enhanced meta information with animated underline */}
                    <div className="relative mb-6">
                      <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium mb-2 transform transition-all duration-500">
                        {item.meta}
                      </p>
                      <div 
                        className={`h-0.5 bg-gradient-to-r from-white/40 to-transparent transition-all duration-700 ease-out ${
                          state === 'active' ? 'w-16 opacity-100' : 'w-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '300ms' }}
                      />
                    </div>
                    
                    {/* Enhanced heading with improved typography */}
                    <h3 
                      className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-8 leading-tight tracking-tight"
                      style={{ 
                        fontFamily: 'var(--font-sans)',
                        textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Enhanced body text with better readability */}
                    <p className="text-white/85 text-lg lg:text-xl leading-relaxed font-light max-w-2xl">
                      {item.body}
                    </p>

                    {/* Animated call-to-action element */}
                    <div 
                      className={`mt-8 transform transition-all duration-700 ease-out ${
                        state === 'active' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                      }`}
                      style={{ transitionDelay: '500ms' }}
                    >
                      <div className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300 cursor-pointer group">
                        <span className="text-sm uppercase tracking-wider font-medium">Learn More</span>
                        <div className="w-8 h-0.5 bg-white/40 group-hover:bg-white transition-all duration-300 group-hover:w-12" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Smooth sliding cards stack */}
            <div className="pointer-events-auto flex-shrink-0 relative w-80 lg:w-[420px] xl:w-[480px] h-[600px]">
              {/* Cards container with overflow hidden for smooth sliding */}
              <div className="relative w-full h-full overflow-hidden">
                {items.map((item, index) => {
                  const cardStyle = getCardTransform(index);
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute inset-0 w-full h-full"
                      style={{
                        transform: cardStyle.transform,
                        opacity: cardStyle.opacity,
                        zIndex: cardStyle.zIndex,
                        transition: 'none', // Remove CSS transitions for smooth scroll sync
                        willChange: 'transform, opacity'
                      }}
                    >
                      {/* Card background glow effect */}
                      <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl scale-110" />
                      
                      <div 
                        className="
                          relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 
                          border border-white/20 shadow-2xl h-full
                          hover:bg-white/15 hover:shadow-3xl
                          before:absolute before:inset-0 before:rounded-3xl 
                          before:bg-gradient-to-br before:from-white/10 before:to-transparent 
                          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                        "
                        style={{
                          backdropFilter: 'blur(20px) saturate(180%)'
                        }}
                      >
                        {/* Dynamic image with overlay effects */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-white/5 group">
                          <img
                            src={item.img || '/api/placeholder/600/400'}
                            alt={item.title || 'Showcase image'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          {/* Image overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Image loading indicator */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping" />
                        </div>

                        {/* Card content */}
                        <div className="space-y-4 flex-1">
                          {/* Card title */}
                          <h4 
                            className="text-xl lg:text-2xl font-light text-white leading-tight"
                            style={{ 
                              fontFamily: 'var(--font-sans)',
                              textShadow: '0 1px 10px rgba(0,0,0,0.2)'
                            }}
                          >
                            {item.title}
                          </h4>
                          
                          {/* Card meta */}
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-white/60 to-white/20 rounded-full" />
                            <p className="text-white/60 text-sm uppercase tracking-wider font-medium">
                              {item.meta}
                            </p>
                          </div>
                          
                          {/* Card description */}
                          <p className="text-white/80 leading-relaxed text-base font-light">
                            {item.body}
                          </p>
                        </div>

                        {/* Progress indicator */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                          <div className="flex space-x-2">
                            {items.map((_, idx) => (
                              <div
                                key={`indicator-${idx}`}
                                className={`
                                  h-1 rounded-full transition-all duration-300
                                  ${idx === index 
                                    ? 'bg-white w-8' 
                                    : 'bg-white/30 w-2'
                                  }
                                `}
                              />
                            ))}
                          </div>
                          
                          {/* Slide counter */}
                          <div className="text-white/50 text-sm font-light">
                            <span className="text-white font-medium">{String(index + 1).padStart(2, '0')}</span>
                            <span className="mx-1">/</span>
                            <span>{String(items.length).padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export types for external use
export type { ShowcaseItem, ScrollTriggeredShowcaseProps };