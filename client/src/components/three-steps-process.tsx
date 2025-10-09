import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

const steps = [
  {
    number: "1",
    icon: "📄", // Document/blueprint icon
    heading: "Upload your 3D models and start configuring",
    description: "We support over 35 file formats including STL, OBJ, STEP, ZIP. All uploads are secure and confidential.",
    hasLink: false
  },
  {
    number: "2", 
    icon: "📚", // Layers/material stacks icon
    heading: "Choose the material, finish and color",
    description: "Our catalog contains more than 20 different technologies and over 100 materials, with a variety of different finish and color options.",
    hasLink: true,
    linkText: "See our materials →"
  },
  {
    number: "3",
    icon: "📦", // 3D cube/box icon
    heading: "Select the best offer and get your parts delivered", 
    description: "Choose your preferred manufacturer from more than 150 professional services worldwide and receive your order fast and hassle-free.",
    hasLink: false
  }
];

export default function ThreeStepsProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !sectionRef.current) return;

    const section = sectionRef.current;
    const cards = cardsRef.current;
    const title = section.querySelector('.main-title');
    const subtitle = section.querySelector('.main-subtitle');

    // Set initial states with more dramatic effects
    gsap.set(cards, {
      y: 120,
      opacity: 0,
      scale: 0.8,
      rotationY: -15,
      transformPerspective: 1000
    });

    gsap.set(title, {
      y: 50,
      opacity: 0,
      scale: 0.9
    });

    gsap.set(subtitle, {
      y: 30,
      opacity: 0
    });

    // Enhanced entrance animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        end: "bottom 25%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate title first
    tl.to(title, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    })
    // Then subtitle
    .to(subtitle, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    // Then cards with advanced stagger
    .to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.2,
      stagger: {
        amount: 0.6,
        from: "start",
        ease: "power2.out"
      },
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Keep cards and badges static after entrance animation

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });

    };
  }, [isLoaded, gsap, ScrollTrigger]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-white"
      data-testid="three-steps-process"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            3D printing online
          </h2>
          <p className="text-sm md:text-base text-gray-500 uppercase tracking-wider font-medium">
            3 EASY STEPS TO GET YOUR PARTS PRODUCED
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="step-card relative bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 cursor-pointer group"
              onMouseEnter={(e) => {
                // Only subtle shadow change on hover, no movement
                if (gsap) {
                  gsap.to(e.currentTarget, {
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (gsap) {
                  gsap.to(e.currentTarget, {
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }
              }}
            >
              {/* Number Badge */}
              <div className="number-badge absolute -top-4 -left-4 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="step-icon text-4xl mb-6 text-orange-500">
                {step.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-black leading-tight">
                  {step.heading}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {step.hasLink && (
                  <a 
                    href="#" 
                    className="inline-flex items-center text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200"
                  >
                    {step.linkText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}