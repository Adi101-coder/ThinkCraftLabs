import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export function useGSAP() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const loadGSAP = async () => {
      if (!window.gsap) {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.async = true;
        document.head.appendChild(gsapScript);

        await new Promise(resolve => {
          gsapScript.onload = resolve;
        });
      }

      if (!window.ScrollTrigger) {
        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        scrollTriggerScript.async = true;
        document.head.appendChild(scrollTriggerScript);

        await new Promise(resolve => {
          scrollTriggerScript.onload = resolve;
        });
      }

      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setIsLoaded(true);
      }
    };

    loadGSAP();
  }, [isLoaded]);

  return {
    gsap: window.gsap,
    ScrollTrigger: window.ScrollTrigger,
    isLoaded
  };
}
