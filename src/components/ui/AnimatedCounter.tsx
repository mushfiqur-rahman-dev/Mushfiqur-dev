import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className = '',
  duration = 1.4,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<string>(() => (prefersReducedMotion ? value : '0'));

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const match = value.match(/^([^0-9.]*)([0-9.]+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const targetNum = parseFloat(match[2]);
    const suffix = match[3];
    const isFloat = match[2].includes('.');
    const decimals = isFloat ? match[2].split('.')[1].length : 0;

    if (!isInView) {
      const id = setTimeout(() => {
        setDisplayValue(`${prefix}0${suffix}`);
      }, 0);
      return () => clearTimeout(id);
    }

    const controls = animate(0, targetNum, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const formatted = decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest).toString();
        setDisplayValue(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, prefersReducedMotion]);

  const output = prefersReducedMotion ? value : displayValue;

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
};
