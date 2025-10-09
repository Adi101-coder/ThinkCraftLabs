import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * UnifiedThemeMorph Component
 * Creates seamless theme transition between ShowcaseGallery and ChallengesSection
 * Both sections feel like one continuous component changing its theme
 */
export default function UnifiedThemeMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to theme values - fast transition completes before challenges section
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 0.65, 1],
    [
      'rgb(249, 250, 251)', // Light gray start
      'rgb(249, 250, 251)', // Hold gray until halfway through showcase
      'hsl(21, 100%, 51%)', // Fast orange transition completes at 65%
      'hsl(21, 100%, 51%)'  // Orange locked for challenges section
    ]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.5, 0.65, 1],
    [
      'rgb(31, 41, 55)',    // Dark gray start
      'rgb(31, 41, 55)',    // Hold dark until halfway through showcase
      'rgb(255, 255, 255)', // Fast white transition completes at 65%
      'rgb(255, 255, 255)'  // White locked for challenges section
    ]
  );

  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.5, 0.65, 1],
    [
      'rgb(107, 114, 128)', // Gray accent start
      'rgb(107, 114, 128)', // Hold gray accent until halfway through showcase
      'rgb(255, 255, 255)', // Fast white accent transition completes at 65%
      'rgb(255, 255, 255)'  // White accent locked for challenges section
    ]
  );

  // Update CSS variables for theme synchronization
  useEffect(() => {
    const unsubscribe = backgroundColor.onChange((latest) => {
      document.documentElement.style.setProperty('--theme-bg', latest);
    });
    return unsubscribe;
  }, [backgroundColor]);

  useEffect(() => {
    const unsubscribe = textColor.onChange((latest) => {
      document.documentElement.style.setProperty('--theme-text', latest);
    });
    return unsubscribe;
  }, [textColor]);

  useEffect(() => {
    const unsubscribe = accentColor.onChange((latest) => {
      document.documentElement.style.setProperty('--theme-accent', latest);
    });
    return unsubscribe;
  }, [accentColor]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        backgroundColor,
        color: textColor,
      }}
      className="relative transition-all duration-700 ease-in-out"
    >
      {/* Showcase Gallery Section */}
      <motion.div
        style={{
          backgroundColor: 'transparent', // Let parent handle background
        }}
        className="relative z-10"
      >
        <ShowcaseGalleryContent />
      </motion.div>

      {/* Challenges Section */}
      <motion.div
        style={{
          backgroundColor: 'transparent', // Let parent handle background
        }}
        className="relative z-10"
      >
        <ChallengesSectionContent />
      </motion.div>

      {/* Smooth gradient overlay for enhanced blending */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.5, 0.65, 1],
            [
              'linear-gradient(to bottom, transparent 0%, transparent 100%)',
              'linear-gradient(to bottom, transparent 0%, transparent 100%)',
              'linear-gradient(to bottom, rgba(249,250,251,0.4) 0%, rgba(255,127,39,0.4) 100%)',
              'linear-gradient(to bottom, transparent 0%, transparent 100%)'
            ]
          )
        }}
      />
    </motion.div>
  );
}

/**
 * ShowcaseGalleryContent - Extracted content without background styling
 */
function ShowcaseGalleryContent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section 
      ref={sectionRef}
      className="showcase-gallery py-12 sm:py-16 md:py-20 min-h-screen flex items-center"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Grid container with responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 sm:gap-6 md:gap-8 h-auto lg:h-[80vh]">
          
          {/* Left Image Card - 40% width on desktop */}
          <div 
            className={`
              lg:col-span-4 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer
              h-64 sm:h-80 md:h-96 lg:h-full
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
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                3D Solutions
              </h3>
            </div>
          </div>

          {/* Middle Quote Card - 30% width on desktop */}
          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer bg-white
              h-64 sm:h-80 md:h-96 lg:h-full
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
              <div className="text-center max-w-xs">
                <p className="text-gray-800 text-xs sm:text-sm font-medium leading-relaxed tracking-wide uppercase">
                  Turning Imagination Into Reality with precision-crafted 3D printing solutions tailored for your business needs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Card - 30% width on desktop */}
          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer
              h-64 sm:h-80 md:h-96 lg:h-full
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
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                Innovation
              </h3>
            </div>
          </div>
        </div>

        {/* Second Row - responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 h-auto lg:h-[80vh]">
          
          <div 
            className={`
              lg:col-span-4 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer bg-white
              h-64 sm:h-80 md:h-96 lg:h-full
              transition-all duration-700 ease-out hover:shadow-2xl
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
              <div className="text-center max-w-md">
                <p className="text-gray-800 text-sm sm:text-base font-medium leading-relaxed tracking-wide uppercase">
                  From concept to creation, we help you design, test, and deliver faster than ever before
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer
              h-64 sm:h-80 md:h-96 lg:h-full
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
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
              <h3 className="text-white text-xl sm:text-2xl font-bold">
                Materials
              </h3>
            </div>
          </div>

          <div 
            className={`
              lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl cursor-pointer
              h-64 sm:h-80 md:h-96 lg:h-full
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
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                Solutions
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ChallengesSectionContent - Extracted content without background styling
 */
function ChallengesSectionContent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          {/* Main Heading - Left Aligned with Staggered Word Animation */}
          <h1
            className="text-white font-normal leading-[0.85] mb-6 sm:mb-8 md:mb-10 text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {/* First Line - YOUR BIGGEST */}
            <div className="overflow-visible mb-2 sm:mb-3 md:mb-4">
              {['YOUR', 'BIGGEST'].map((word, index) => (
                <span
                  key={word}
                  className={`
                    inline-block transition-all duration-1000 ease-out
                    hover:text-orange-200 cursor-default
                    ${isVisible 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-12 -translate-x-8'
                    }
                  `}
                  style={{
                    transitionDelay: `${200 + index * 150}ms`,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    marginRight: index === 0 ? '0.5em' : '0'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Second Line - CHALLENGES DON'T */}
            <div className="overflow-visible mb-2 sm:mb-3 md:mb-4 whitespace-nowrap">
              {['CHALLENGES', "DON'T"].map((word, index) => (
                <span
                  key={word}
                  className={`
                    inline-block transition-all duration-1000 ease-out
                    hover:text-orange-200 cursor-default
                    ${isVisible 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-12 translate-x-8'
                    }
                  `}
                  style={{
                    transitionDelay: `${500 + index * 150}ms`,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    marginRight: index === 0 ? '0.5em' : '0'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Third Line - SCARE US */}
            <div className="overflow-visible">
              {['SCARE', 'US'].map((word, index) => (
                <span
                  key={word}
                  className={`
                    inline-block transition-all duration-1000 ease-out
                    hover:text-orange-200 hover:scale-105 cursor-default
                    ${isVisible 
                      ? 'opacity-100 translate-y-0 rotate-0' 
                      : 'opacity-0 translate-y-12 -rotate-3'
                    }
                  `}
                  style={{
                    transitionDelay: `${800 + index * 150}ms`,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transformOrigin: 'center bottom',
                    marginRight: index === 0 ? '0.5em' : '0'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </h1>

          {/* Subtitle with Left Line */}
          <div
            className={`
              flex items-start gap-6 max-w-2xl
              transition-all duration-1000 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '400ms' }}
          >
            {/* Animated Vertical Line */}
            <div 
              className={`
                w-0.5 mt-1 flex-shrink-0 bg-white/60 transition-all duration-1200 ease-out
                ${isVisible ? 'h-12 sm:h-16 opacity-100' : 'h-0 opacity-0'}
              `}
              style={{
                transitionDelay: '1000ms',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
            />

            {/* Paragraph Text with Character Animation */}
            <div className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed">
              {/* First line of paragraph */}
              <div className="mb-2">
                {['Big', 'or', 'small,', '5', 'employees', 'or', '5,000,', 'most', 'organizations'].map((word, wordIndex) => (
                  <span
                    key={`line1-${word}-${wordIndex}`}
                    className={`
                      inline-block mr-2 transition-all duration-800 ease-out
                      hover:text-white hover:scale-105 cursor-default
                      ${isVisible 
                        ? 'opacity-100 translate-y-0 blur-0' 
                        : 'opacity-0 translate-y-4 blur-sm'
                      }
                    `}
                    style={{
                      transitionDelay: `${1200 + wordIndex * 80}ms`,
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* Second line of paragraph */}
              <div>
                {['face', 'the', 'same', 'challenges', 'at', 'different', 'scales:'].map((word, wordIndex) => (
                  <span
                    key={`line2-${word}-${wordIndex}`}
                    className={`
                      inline-block mr-2 transition-all duration-800 ease-out
                      hover:text-white hover:scale-105 cursor-default
                      ${isVisible 
                        ? 'opacity-100 translate-y-0 blur-0' 
                        : 'opacity-0 translate-y-4 blur-sm'
                      }
                    `}
                    style={{
                      transitionDelay: `${1900 + wordIndex * 80}ms`,
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}