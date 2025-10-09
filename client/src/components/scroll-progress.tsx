import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !progressRef.current) return;

    const progressBar = progressRef.current;

    const scrollTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self: any) => {
        gsap.set(progressBar, { scaleX: self.progress });
      }
    });

    return () => {
      scrollTrigger?.kill();
    };
  }, [isLoaded, gsap, ScrollTrigger]);

  return <div ref={progressRef} className="scroll-progress" />;
}
