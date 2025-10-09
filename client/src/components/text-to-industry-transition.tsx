import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useGSAP } from '@/hooks/use-gsap';

const industries = [
  {
    id: 'retail',
    label: 'RETAIL',
    color: '#00C853',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"
          fill="currentColor"
        />
        <path
          d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"
          fill="currentColor"
        />
      </svg>
    ),
    description: "From custom packaging to product prototypes and display models, we help retail brands bring unique concepts to life. Fast turnaround for seasonal collections, personalized items, and limited edition merchandise."
  },
  {
    id: 'industrial',
    label: 'INDUSTRIAL',
    color: '#424242',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M12 3L2 12H5V20H19V12H22L12 3Z"
          fill="#FF5D05"
        />
        <path
          d="M8 21V15H16V21H8Z"
          fill="#00C853"
        />
        <path
          d="M6 10L8 8V6L10 4L12 6L14 4L16 6V8L18 10"
          stroke="#2196F3"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="7" cy="7" r="1" fill="#FF5D05" />
        <circle cx="17" cy="7" r="1" fill="#00C853" />
      </svg>
    ),
    description: "Engineering-grade parts, functional prototypes, and manufacturing tools. We support automotive, aerospace, electronics, and heavy machinery sectors with precision 3D printing and design consulting for production optimization."
  },
  {
    id: 'education',
    label: 'EDUCATION',
    color: '#FF5D05',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path
          d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
          fill="currentColor"
        />
        <path
          d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
          fill="currentColor"
        />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="16" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    description: "Empower students and researchers with rapid prototyping for academic projects, STEM education models, architectural designs, and research equipment. Partner with universities and institutions to bring learning to life in 3D."
  }
];

/**
 * TextToIndustryTransition Component
 * Creates seamless theme transition between TextReveal and IndustrySelection
 * Both sections feel like one continuous component changing its theme
 */
export default function TextToIndustryTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to theme values - ultra fast transition from orange to white
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 1],
    [
      '#FF5D05',        // Orange start (TextReveal color)
      '#FF5D05',        // Hold orange until 5% (ultra fast)
      '#FFFFFF',        // Transition to white at 15% (ultra fast)
      '#FFFFFF'         // White locked for IndustrySelection
    ]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 1],
    [
      'rgb(255, 255, 255)',  // White text start
      'rgb(255, 255, 255)',  // Hold white until 5% (ultra fast)
      'rgb(31, 41, 55)',     // Transition to dark at 15% (ultra fast)
      'rgb(31, 41, 55)'      // Dark locked for IndustrySelection
    ]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !containerRef.current) return;

    const section = containerRef.current;
    const cards = cardsRef.current;
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const dividers = section.querySelectorAll('.divider-line');

    // Set initial states with more dramatic effects
    gsap.set(cards, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotationY: -15,
      transformPerspective: 1000
    });

    gsap.set([title, subtitle], {
      y: 50,
      opacity: 0,
      scale: 0.95
    });

    gsap.set(dividers, {
      scaleY: 0,
      opacity: 0,
      transformOrigin: "top center"
    });

    // Enhanced animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate title with bounce effect
    tl.to(title, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "back.out(1.7)"
    })
    // Animate subtitle with slide and fade
    .to(subtitle, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    // Animate dividers growing from top
    .to(dividers, {
      scaleY: 1,
      opacity: 0.3,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    // Animate cards with advanced 3D effects and stagger
    .to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.4,
      stagger: {
        amount: 0.6,
        from: "start",
        ease: "power2.out"
      },
      ease: "back.out(1.4)"
    }, "-=0.3");

    // Add floating animation to cards after initial load
    cards.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: "+=8",
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [isLoaded, gsap, ScrollTrigger]);

  const handleCardHover = (index: number, isHovering: boolean) => {
    if (!gsap) return;

    const card = cardsRef.current[index];
    const iconBadge = card?.querySelector('.icon-badge');
    const descriptionBox = card?.querySelector('.description-box');
    const learnMore = card?.querySelector('.learn-more');
    const cardLabel = card?.querySelector('.card-label');
    const cardContent = card?.querySelector('.card-content');

    if (isHovering) {
      // Enhanced card lift with rotation and scale
      gsap.to(card, {
        y: -15,
        scale: 1.02,
        rotationY: 2,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
      // Icon badge with bounce and glow effect
      gsap.to(iconBadge, {
        scale: 1.15,
        rotation: 10,
        boxShadow: `0 0 20px ${industries[index].color}40`,
        duration: 0.5,
        ease: "back.out(2)"
      });

      // Description box with enhanced glow and scale
      gsap.to(descriptionBox, {
        scale: 1.02,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#FFFFFF",
        duration: 0.4,
        ease: "power2.out"
      });

      // Learn more with slide and color change
      gsap.to(learnMore, {
        x: 8,
        color: industries[index].color,
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      // Label with subtle scale and color shift
      gsap.to(cardLabel, {
        scale: 1.05,
        color: industries[index].color,
        duration: 0.4,
        ease: "power2.out"
      });

      // Content area with subtle lift
      gsap.to(cardContent, {
        y: -2,
        duration: 0.4,
        ease: "power2.out"
      });

    } else {
      // Return to original state with smooth transitions
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        duration: 0.5,
        ease: "power2.out"
      });
      
      gsap.to(iconBadge, {
        scale: 1,
        rotation: 0,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        duration: 0.5,
        ease: "power2.out"
      });

      gsap.to(descriptionBox, {
        scale: 1,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#F5F7FA",
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(learnMore, {
        x: 0,
        color: "#666",
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(cardLabel, {
        scale: 1,
        color: "#1F2937",
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(cardContent, {
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      style={{
        backgroundColor,
        color: textColor,
      }}
      className="relative transition-all duration-700 ease-in-out py-0"
      data-testid="text-to-industry-transition"
    >
      {/* Seamless blending overlay - no visible gradients */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'transparent'
        }}
      />
      
      {/* Industry Selection Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Solutions Tailored to Your Industry
          </h2>
          <p className="section-subtitle text-lg md:text-xl max-w-3xl mx-auto">
            Select your sector to discover how ThinkCraft transforms your ideas into reality
          </p>
        </div>

        {/* Industry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative pb-20">
          {/* No dividers or background decorations for seamless look */}

          {industries.map((industry, index) => (
            <div
              key={industry.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="industry-card rounded-3xl p-8 cursor-pointer transition-all duration-500 relative overflow-hidden"
              style={{
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full"
                  style={{ backgroundColor: industry.color }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
                  style={{ backgroundColor: industry.color }}
                ></div>
              </div>

              <div className="card-content relative z-10">
                {/* Enhanced Icon Badge */}
                <div className="flex justify-center mb-8">
                  <div 
                    className="icon-badge w-24 h-24 rounded-full flex items-center justify-center text-white relative"
                    style={{ 
                      backgroundColor: industry.color,
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {industry.icon}
                    {/* Subtle glow ring */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ 
                        boxShadow: `inset 0 0 20px ${industry.color}`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Enhanced Label */}
                <h3 className="card-label text-2xl font-bold text-gray-900 text-center mb-8 tracking-wide relative">
                  {industry.label}
                  {/* Underline decoration */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-12 rounded-full opacity-30"
                    style={{ backgroundColor: industry.color }}
                  ></div>
                </h3>

                {/* Enhanced Description Box */}
                <div 
                  className="description-box rounded-2xl p-6 mb-4 relative overflow-hidden"
                  style={{
                    backgroundColor: "#F5F7FA",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.8)"
                  }}
                >
                  {/* Subtle gradient overlay */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1 opacity-50"
                    style={{ 
                      background: `linear-gradient(90deg, ${industry.color}, transparent)`
                    }}
                  ></div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    {industry.description}
                  </p>
                  
                  <div className="flex justify-end">
                    <span className="learn-more text-sm font-semibold text-gray-600 cursor-pointer inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                      learn more 
                      <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}