import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ShowcaseToChallengesTransition Component
 * Smooth transition bridge between ShowcaseGallery and ChallengesSection
 */
export default function ShowcaseToChallengesTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    threshold: 0.3,
    once: false 
  });

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '40vh' }} // Transition zone height
    >
      {/* Outgoing showcase content - fades out and slides left */}
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={isInView ? { opacity: 0, x: -50 } : { opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0 
        }}
        className="absolute inset-0 bg-gray-50 flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={isInView ? { opacity: 0 } : { opacity: 0.8 }}
              transition={{ duration: 0.4 }}
              className="text-gray-400 text-lg font-light"
            >
              Showcase Gallery
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Incoming challenges content - fades in and slides from right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.2 
        }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: 'hsl(21, 100%, 51%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-white/80 text-lg font-light"
            >
              Challenges Ahead
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Background gradient overlay for smooth color blending */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            rgb(249, 250, 251) 0%, 
            rgba(249, 250, 251, 0.8) 30%,
            rgba(255, 127, 39, 0.8) 70%,
            hsl(21, 100%, 51%) 100%
          )`
        }}
      />
    </div>
  );
}