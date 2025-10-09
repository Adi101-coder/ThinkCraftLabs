import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ShowcaseGallery Component
 * Enhanced with advanced animations and visual effects
 */
export default function ShowcaseGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for parallax effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, []);

  // Card hover handlers
  const handleCardHover = useCallback((cardId: string) => {
    setHoveredCard(cardId);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="showcase-gallery py-20 bg-gray-50 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Grid container with 40:30:30 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-[80vh]">
          
          {/* Left Image Card - 40% width */}
          <div 
            className={`
              lg:col-span-4 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '0ms' }}

          >
            <img
              src="/images/efe-yagiz-soysal-SU2yTv4Hwis-unsplash.jpg"
              alt="3D Printing Solutions"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-3xl font-bold">
                3D Solutions
              </h3>
            </div>
          </div>

          {/* Middle Quote Card - 30% width */}
          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-white
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '200ms' }}

          >
            {/* Quote Content - Center */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="text-center max-w-xs">
                <p className="text-gray-800 text-sm font-medium leading-relaxed tracking-wide uppercase">
                  Turning Imagination Into Reality with precision-crafted 3D printing solutions tailored for your business needs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Card - 30% width */}
          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '400ms' }}

          >
            <img
              src="/images/jakub-zerdzicki-Fu0SMJHZtKg-unsplash.jpg"
              alt="Advanced Manufacturing"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-3xl font-bold">
                Innovation
              </h3>
            </div>
          </div>
        </div>

        {/* Second Row - 40:30:30 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-16 h-[80vh]">
          
          <div 
            className={`
              lg:col-span-4 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-white
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            {/* Quote Content - Center */}
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <div className="text-center max-w-md">
                <p className="text-gray-800 text-base font-medium leading-relaxed tracking-wide uppercase">
                  From concept to creation, we help you design, test, and deliver faster than ever before
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '700ms' }}
          >
            <img
              src="/images/new-data-services-CoymjeSkavc-unsplash.jpg"
              alt="Advanced Materials"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-2xl font-bold">
                Materials
              </h3>
            </div>
          </div>

          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-3xl shadow-xl cursor-pointer
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '800ms' }}
          >
            <img
              src="/images/tom-claes-mNVh70d9zUU-unsplash (1).jpg"
              alt="Custom Solutions"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-3xl font-bold">
                Solutions
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}