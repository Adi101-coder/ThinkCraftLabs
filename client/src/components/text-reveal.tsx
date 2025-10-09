import { useEffect, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';

const textContentSmall = "At Think Craft Lab,\u00A0we transform bold ideas into tangible reality. With eight years of expertise in 3D design and printing,\u00A0we deliver precision solutions that drive business success.";

const textContentLarge = "At Think Craft Lab,\u00A0we are fueled by innovation and excellence in 2D and 3D design,\u00A0consulting,\u00A0and advanced 3D printing solutions. With eight years of expertise,\u00A0we transform bold ideas into tangible reality with precision. Our approach combines technical mastery with creative vision,\u00A0delivering solutions that drive business success and exceed expectations.";

export default function TextReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { gsap, ScrollTrigger, isLoaded } = useGSAP();

  // Split text into words, then each word into characters
  const splitTextIntoWords = (text: string) => {
    return text.split(' ').map((word, wordIndex) => ({
      word,
      wordIndex,
      chars: word.split('').map((char, charIndex) => ({
        char,
        charIndex,
        globalIndex: text.substring(0, text.indexOf(word) + charIndex).length
      }))
    }));
  };

  useEffect(() => {
    if (!isLoaded || !gsap || !ScrollTrigger || !sectionRef.current) return;

    const section = sectionRef.current;
    
    // Get all characters and filter by their parent container
    const allChars = section.querySelectorAll('.char');
    
    // Set initial state - all characters are dim
    gsap.set(allChars, {
      opacity: 0.3,
      color: 'rgba(255, 255, 255, 0.3)'
    });

    // Character-by-character highlighting based on scroll progress
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.1,
      onUpdate: (self: any) => {
        const progress = self.progress;
        
        // Filter characters that are currently visible (not hidden by responsive classes)
        const visibleChars = Array.from(allChars).filter((char) => {
          const element = char as HTMLElement;
          const computedStyle = window.getComputedStyle(element.closest('.block, .hidden') || element);
          return computedStyle.display !== 'none';
        });
        
        const totalChars = visibleChars.length;
        const charsToHighlight = Math.floor(progress * totalChars);

        visibleChars.forEach((char, index) => {
          if (index <= charsToHighlight) {
            // Highlighted characters - bright white
            gsap.to(char, {
              opacity: 1,
              color: '#ffffff',
              duration: 0.05
            });
          } else {
            // Unhighlighted characters - dim
            gsap.to(char, {
              opacity: 0.3,
              color: 'rgba(255, 255, 255, 0.3)',
              duration: 0.05
            });
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [isLoaded, gsap, ScrollTrigger]);

  return (
    <section 
      id="text-reveal" 
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-primary text-primary-foreground relative overflow-hidden min-h-screen flex items-center"
      data-testid="text-reveal-section"
      style={{
        backgroundColor: '#FF5D05',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Small screens - shorter text */}
        <div className="block lg:hidden text-2xl sm:text-3xl md:text-5xl font-normal" data-testid="reveal-text" style={{ fontFamily: 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '-0.02em', lineHeight: '1.5', wordBreak: 'keep-all', hyphens: 'none', overflowWrap: 'normal', whiteSpace: 'pre-wrap' }}>
          <p className="text-reveal-paragraph prevent-word-break" data-testid="text-paragraph">
            {splitTextIntoWords(textContentSmall).map((wordObj, wordIndex) => (
              <span key={wordIndex} className="word-container inline-block" style={{ whiteSpace: 'nowrap' }}>
                {wordObj.chars.map((charObj, charIndex) => (
                  <span
                    key={`${wordIndex}-${charIndex}`}
                    className="char inline-block"
                    data-global-index={wordObj.chars.reduce((acc, _, i) => i <= charIndex ? acc + 1 : acc, 
                      textContentSmall.substring(0, textContentSmall.split(' ').slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)).length)}
                    style={{
                      transition: 'color 0.2s ease, opacity 0.2s ease'
                    }}
                  >
                    {charObj.char}
                  </span>
                ))}
                {wordIndex < splitTextIntoWords(textContentSmall).length - 1 && (
                  <span className="char inline-block" 
                    data-global-index={textContentSmall.substring(0, textContentSmall.split(' ').slice(0, wordIndex + 1).join(' ').length).length}
                    style={{ transition: 'color 0.2s ease, opacity 0.2s ease' }}>
                    &nbsp;
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Large screens - longer text */}
        <div className="hidden lg:block lg:text-5xl xl:text-6xl 2xl:text-7xl font-normal" data-testid="reveal-text" style={{ fontFamily: 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: '400', letterSpacing: '-0.03em', lineHeight: '1.25', wordBreak: 'keep-all', hyphens: 'none', overflowWrap: 'normal', whiteSpace: 'pre-wrap' }}>
          <p className="text-reveal-paragraph prevent-word-break" data-testid="text-paragraph">
            {splitTextIntoWords(textContentLarge).map((wordObj, wordIndex) => (
              <span key={wordIndex} className="word-container inline-block" style={{ whiteSpace: 'nowrap' }}>
                {wordObj.chars.map((charObj, charIndex) => (
                  <span
                    key={`${wordIndex}-${charIndex}`}
                    className="char inline-block"
                    data-global-index={wordObj.chars.reduce((acc, _, i) => i <= charIndex ? acc + 1 : acc, 
                      textContentLarge.substring(0, textContentLarge.split(' ').slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)).length)}
                    style={{
                      transition: 'color 0.2s ease, opacity 0.2s ease'
                    }}
                  >
                    {charObj.char}
                  </span>
                ))}
                {wordIndex < splitTextIntoWords(textContentLarge).length - 1 && (
                  <span className="char inline-block" 
                    data-global-index={textContentLarge.substring(0, textContentLarge.split(' ').slice(0, wordIndex + 1).join(' ').length).length}
                    style={{ transition: 'color 0.2s ease, opacity 0.2s ease' }}>
                    &nbsp;
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
