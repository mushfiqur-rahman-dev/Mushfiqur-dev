import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, PaperPlaneTilt } from '@phosphor-icons/react';
import { ambientAudio } from '../../audio/AmbientAudio';
import { Magnetic } from './Magnetic';

export const LiquidHero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-driven exit transformation as user scrolls past hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.75], [0, -40]);

  const scrollTo = (id: string) => {
    ambientAudio.playInteractiveHover();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 32,
      filter: prefersReducedMotion ? 'none' : 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-20 pb-12 overflow-hidden"
    >
      {/* Subtle Studio Dot Matrix Backdrop */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      {/* Main Center Content with Scroll-Story Scrub */}
      <motion.div
        style={{
          opacity: prefersReducedMotion ? 1 : heroOpacity,
          scale: prefersReducedMotion ? 1 : heroScale,
          y: prefersReducedMotion ? 0 : heroY,
        }}
        className="w-full flex flex-col items-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 space-y-7 sm:space-y-9"
        >
          {/* Big High-Contrast Liquid Chrome Heading */}
          <motion.div variants={itemVariants} className="space-y-1 sm:space-y-2">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-black leading-[0.9] select-none uppercase">
              Mushfiq
            </h1>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter liquid-text leading-[0.9] select-none uppercase">
              Visions
            </h2>
          </motion.div>

          {/* Elegant Minimalist Tagline */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed tracking-tight px-4"
          >
            Architecting ultra-modern web experiences, spatial interfaces, and high-performance applications with precision and procedural elegance.
          </motion.p>

          {/* Dual Pill CTA Buttons with Magnetic Spring Physics */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Magnetic distance={10}>
              <button
                onClick={() => scrollTo('projects')}
                className="hero-btn-primary flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Works</span>
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>
            </Magnetic>

            <Magnetic distance={10}>
              <button
                onClick={() => scrollTo('contact')}
                className="hero-btn-secondary flex items-center gap-2 group cursor-pointer"
              >
                <PaperPlaneTilt
                  size={18}
                  weight="bold"
                  className="text-slate-700 group-hover:rotate-12 transition-transform duration-300"
                />
                <span>Get in Touch</span>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Cue Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 flex flex-col items-center gap-2 text-slate-400 pointer-events-none"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-1 h-3 rounded-full bg-slate-300"
        />
      </motion.div>
    </section>
  );
};
