import { useRef } from 'react';

const words = ['CREATIVE', 'BOLD', 'DYNAMIC'];
const angledWords = ['INNOVATIVE', 'STRATEGIC', 'VISIONARY'];

export default function AnimatedMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const angledMarqueeRef = useRef<HTMLDivElement>(null);

  return (
    <section className="h-screen flex items-center justify-center overflow-hidden bg-white relative">
      {/* Original horizontal marquee */}
      <div className="marquee-container w-full relative">
        <div
          ref={marqueeRef}
          className="marquee-content flex whitespace-nowrap"
          style={{
            animation: 'marqueeScroll 240s linear infinite',
            width: 'max-content'
          }}
        >
          {/* Repeat words multiple times for seamless loop */}
          {[...Array(10)].map((_, setIndex) => (
            <div key={setIndex} className="flex">
              {words.map((word, wordIndex) => (
                <span
                  key={`${setIndex}-${wordIndex}`}
                  className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase mx-20 text-black"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Angled marquee from left to right */}
      <div className="angled-marquee-container absolute inset-0 pointer-events-none">
        <div
          ref={angledMarqueeRef}
          className="angled-marquee-content flex whitespace-nowrap"
          style={{
            animation: 'angledMarqueeScroll 280s linear infinite',
            width: 'max-content',
            transform: 'rotate(45deg)',
            transformOrigin: 'center center'
          }}
        >
          {/* Repeat words multiple times for seamless loop */}
          {[...Array(8)].map((_, setIndex) => (
            <div key={setIndex} className="flex">
              {angledWords.map((word, wordIndex) => (
                <span
                  key={`${setIndex}-${wordIndex}`}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mx-16 text-gray-400"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    opacity: 0.6
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}