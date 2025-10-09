import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !heroRef.current) return;

    const heroWords = heroRef.current.querySelectorAll('.hero-word');

    gsap.set(heroWords, { opacity: 1, x: 0 });

    const scrollTrigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self: any) => {
        heroWords.forEach((word: Element) => {
          const direction = (word as HTMLElement).dataset.direction;
          const progress = self.progress;
          const moveDistance = 300; // Increased distance for more dramatic effect
          const moveDirection = direction === 'right' ? moveDistance : -moveDistance;

          gsap.set(word, {
            x: progress * moveDirection,
            opacity: Math.max(0.2, 1 - progress * 0.8) // Keep some opacity for visibility
          });
        });
      }
    });

    return () => {
      scrollTrigger?.kill();
    };
  }, [isLoaded, gsap, ScrollTrigger]);

  // Mouse movement parallax effect for images
  useEffect(() => {
    if (!isLoaded || !gsap || !heroRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !image1Ref.current || !image2Ref.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize mouse position (-1 to 1)
      const normalizedX = mouseX / (rect.width / 2);
      const normalizedY = mouseY / (rect.height / 2);

      // Apply movement to images (same direction, increased intensity)
      gsap.to(image1Ref.current, {
        x: normalizedX * 25, // Increased intensity
        y: normalizedY * 18,
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(image2Ref.current, {
        x: normalizedX * 30, // Same direction, slightly more intensity
        y: normalizedY * 20,
        duration: 0.7,
        ease: "power2.out"
      });
    };

    heroRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isLoaded, gsap]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden"
      data-testid="hero-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
        <div className="space-y-2 sm:space-y-4 md:space-y-6">
          <div className="hero-line hero-text text-left flex items-baseline flex-wrap" data-testid="hero-line-1">
            <span className="hero-word mr-2 sm:mr-4 md:mr-6" data-direction="left">TRANSFORMING</span>
            <div
              ref={image1Ref}
              className="inline-block w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden mx-1 sm:mx-2 md:mx-3 flex-shrink-0 relative top-1 sm:top-2 hero-image"
            >
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                alt="3D Design"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hero-word" data-direction="right">IDEAS</span>
          </div>
          <div className="hero-line hero-text text-left flex flex-wrap" data-testid="hero-line-2">
            <span className="hero-word mr-2 sm:mr-4 md:mr-6" data-direction="left">INTO</span>
            <span className="hero-word" data-direction="right">REALITY</span>
          </div>
          <div className="hero-line hero-text text-left flex items-baseline flex-wrap" data-testid="hero-line-3">
            <span className="hero-word mr-2 sm:mr-4 md:mr-6" data-direction="left">THROUGH</span>
            <div
              ref={image2Ref}
              className="inline-block w-10 h-6 sm:w-16 sm:h-10 md:w-20 md:h-12 rounded-lg overflow-hidden mx-1 sm:mx-2 md:mx-3 flex-shrink-0 relative top-1 sm:top-2 hero-image"
            >
              <img
                src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                alt="3D Printing"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hero-word" data-direction="right">INNOVATIVE</span>
          </div>
          <div className="hero-line hero-text text-left flex flex-wrap" data-testid="hero-line-4">
            <span className="hero-word mr-2 sm:mr-4 md:mr-6" data-direction="left">DESIGN &</span>
            <span className="hero-word" data-direction="right">3D PRINTING</span>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 text-left">
          <div className="inline-flex items-center bg-black text-white px-3 py-4 sm:px-4 sm:py-6 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline">LEARN MORE ABOUT OUR DESIGN & 3D PRINTING APPROACH</span>
              <span className="sm:hidden">LEARN MORE</span>
            </span>
            <i className="fas fa-arrow-right ml-2"></i>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center opacity-70">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base" data-testid="scroll-indicator-text">Scroll to explore</p>
          <div className="animate-bounce">
            <i className="fas fa-chevron-down text-primary text-xl sm:text-2xl" data-testid="scroll-indicator-arrow"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
