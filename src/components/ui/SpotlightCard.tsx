import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  spotlightColor?: string;
  delay?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  enableTilt = true,
  spotlightColor = 'rgba(0, 0, 0, 0.05)',
  delay = 0,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Mouse coordinates inside card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Normalized tilt coordinates (-0.5 to 0.5)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const springConfig = { stiffness: 260, damping: 22 };
  const rotateXSpring = useSpring(useTransform(tiltY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateYSpring = useSpring(useTransform(tiltX, [-0.5, 0.5], [-6, 6]), springConfig);
  const scaleSpring = useSpring(isHovered ? 1.01 : 1, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);

      if (enableTilt && !prefersReducedMotion) {
        tiltX.set(x / rect.width - 0.5);
        tiltY.set(y / rect.height - 0.5);
      }

      onMouseMove?.(e);
    },
    [enableTilt, prefersReducedMotion, mouseX, mouseY, tiltX, tiltY, onMouseMove]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    },
    [onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      tiltX.set(0);
      tiltY.set(0);
      onMouseLeave?.(e);
    },
    [tiltX, tiltY, onMouseLeave]
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : 36,
        scale: prefersReducedMotion ? 1 : 0.96,
        filter: prefersReducedMotion ? 'none' : 'blur(8px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{
        once: false,
        amount: 0.15,
        margin: '-50px 0px -50px 0px',
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        perspective: 1000,
        rotateX: enableTilt && !prefersReducedMotion ? rotateXSpring : 0,
        rotateY: enableTilt && !prefersReducedMotion ? rotateYSpring : 0,
        scale: enableTilt && !prefersReducedMotion ? scaleSpring : 1,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...(props as any)}
    >
      {/* Dynamic Cursor Spotlight Radial Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`
          ),
        }}
      />

      {/* Dynamic Border Specular Highlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(280px circle at ${x}px ${y}px, rgba(0, 0, 0, 0.12), transparent 70%)`
          ),
          maskImage: 'linear-gradient(#fff, #fff)',
          WebkitMaskImage: 'linear-gradient(#fff, #fff)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'destination-out',
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};
