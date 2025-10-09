import React from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
  className?: string;
}

/**
 * SectionTransition Component
 * Reusable transition wrapper for smooth component switches
 * Outgoing: fade out + slide left
 * Incoming: fade in + slide from right
 */
export default function SectionTransition({ 
  children, 
  direction = 'right',
  delay = 0,
  className = ''
}: SectionTransitionProps) {
  const slideDistance = 50; // pixels to slide

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'right' ? slideDistance : -slideDistance,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction === 'right' ? -slideDistance : slideDistance,
    }
  };

  const transition = {
    duration: 0.6,
    ease: [0.4, 0.0, 0.2, 1], // ease-in-out cubic-bezier
    delay: delay
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}