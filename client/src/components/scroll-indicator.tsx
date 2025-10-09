import { useEffect, useState } from 'react';

/**
 * ScrollIndicator Component
 * Shows current scroll position to demonstrate smooth scrolling
 */
export default function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);
  const [isSmooth, setIsSmooth] = useState(false);

  useEffect(() => {
    // Check if ScrollSmoother is active
    const checkSmoothScroll = () => {
      const smoothWrapper = document.querySelector('#smooth-wrapper');
      setIsSmooth(!!smoothWrapper);
    };

    // Update scroll position
    const updateScrollPosition = () => {
      // Get scroll position from ScrollSmoother if available
      const smoother = (window as any).ScrollSmoother?.get();
      if (smoother) {
        setScrollY(smoother.scrollTop());
      } else {
        setScrollY(window.scrollY);
      }
    };

    checkSmoothScroll();
    updateScrollPosition();

    // Listen for scroll events
    const handleScroll = () => {
      updateScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for ScrollSmoother updates
    const interval = setInterval(updateScrollPosition, 16); // ~60fps

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex flex-col gap-1">
        <div>Scroll: {Math.round(scrollY)}px</div>
        <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${isSmooth ? 'bg-green-400' : 'bg-red-400'}`}
          />
          <span>{isSmooth ? 'Smooth' : 'Native'}</span>
        </div>
      </div>
    </div>
  );
}