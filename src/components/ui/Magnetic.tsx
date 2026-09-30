import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  distance?: number;
  className?: string;
  onClick?: () => void;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  distance = 12,
  className = '',
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 20, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || prefersReducedMotion) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      x.set((deltaX / (width / 2)) * distance);
      y.set((deltaY / (height / 2)) * distance);
    },
    [distance, prefersReducedMotion, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
