import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CalendarBlank, MapPin, CheckCircle } from '@phosphor-icons/react';
import { EXPERIENCES } from '../../data/portfolioData';
import { ambientAudio } from '../../audio/AmbientAudio';
import { SpotlightCard } from './SpotlightCard';
import { ScrollStoryReveal } from './ScrollStoryReveal';

export const LiquidExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven story beam progression
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 70%'],
  });

  const smoothBeamScale = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  const beamHeight = useTransform(smoothBeamScale, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-24 z-10"
    >
      <div className="max-w-4xl w-full mx-auto space-y-12">
        {/* Section Header */}
        <ScrollStoryReveal direction="up" className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            Experience & <span className="text-chrome-gradient">Leadership</span>
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-600">
            A track record of engineering leadership, scalable product delivery, and performance optimizations.
          </p>
        </ScrollStoryReveal>

        {/* Timeline List with Scroll-Driven Story Beam */}
        <div ref={containerRef} className="relative pl-6 sm:pl-8 space-y-8">
          {/* Base Timeline Track */}
          <div className="absolute left-2.5 sm:left-3 top-3 bottom-3 w-0.5 bg-slate-200/80 rounded-full" />

          {/* Scroll-Progressed Glowing Metallic Story Beam */}
          <motion.div
            style={{ height: beamHeight }}
            className="absolute left-2.5 sm:left-3 top-3 w-0.5 bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 rounded-full origin-top z-0 shadow-[0_0_8px_rgba(0,0,0,0.2)]"
          />

          {EXPERIENCES.map((exp, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Chrome Node with Pulsing Glow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2, margin: '-50px 0px -50px 0px' }}
                transition={{ duration: 0.5, delay: 0.1 * idx, type: 'spring' }}
                className="absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full bg-white border-2 border-slate-900 group-hover:bg-black group-hover:scale-110 transition-all flex items-center justify-center shadow-md z-10 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-slate-900 group-hover:bg-white transition-colors" />
              </motion.div>

              {/* Experience Card */}
              <SpotlightCard
                delay={0.12 * idx}
                enableTilt={true}
                onMouseEnter={() => ambientAudio.playInteractiveHover()}
                className="glass-chrome-card rounded-3xl p-6 sm:p-8 space-y-4 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 border border-slate-200/90"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-xs">
                      <CalendarBlank size={13} weight="bold" />
                      {exp.period}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <MapPin size={13} weight="bold" className="text-slate-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-black transition-colors">
                    {exp.role}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {exp.company}
                  </p>
                </div>

                {/* Achievements */}
                <ul className="space-y-2 pt-1">
                  {exp.description.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5"
                    >
                      <CheckCircle size={16} weight="fill" className="text-slate-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                  {exp.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/70 text-[11px] font-mono text-slate-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
