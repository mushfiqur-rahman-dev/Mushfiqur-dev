import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface ScrollStoryRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scrub?: boolean;
}

export const ScrollStoryReveal: React.FC<ScrollStoryRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 40,
  scrub = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // For continuous scroll scrub mode
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  // Continuous scroll mapping: enters from bottom (0 -> 0.3), stays active (0.3 -> 0.7), exits to top (0.7 -> 1)
  const scrubOpacity = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scrubY = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 1],
    [distance, 0, 0, -distance * 0.75]
  );
  const scrubScale = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.95, 1, 1, 0.96]);
  const scrubBlur = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 1],
    ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(6px)']
  );

  const getInitialOffset = () => {
    if (prefersReducedMotion || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
    }
  };

  const initialOffset = getInitialOffset();

  if (scrub && !prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        <motion.div
          style={{
            opacity: scrubOpacity,
            y: scrubY,
            scale: scrubScale,
            filter: scrubBlur,
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialOffset.x,
        y: initialOffset.y,
        scale: 0.97,
        filter: prefersReducedMotion ? 'none' : 'blur(8px)',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{
        once: false,
        amount: 0.2,
        margin: '-40px 0px -40px 0px',
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
