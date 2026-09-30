import React from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Code, Trophy, Terminal, Handshake } from '@phosphor-icons/react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ambientAudio } from '../../audio/AmbientAudio';
import { SpotlightCard } from './SpotlightCard';
import { AnimatedCounter } from './AnimatedCounter';
import { ScrollStoryReveal } from './ScrollStoryReveal';

export const LiquidAbout: React.FC = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-24 z-10"
    >
      <div className="max-w-5xl w-full mx-auto space-y-12">
        {/* Section Header with ScrollStory Reveal */}
        <ScrollStoryReveal direction="up" className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            About
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            Engineered with <span className="text-chrome-gradient">Precision</span>
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-600">
            Merging deep technical discipline with boundary-pushing creative aesthetics.
          </p>
        </ScrollStoryReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Bio Card (Spans 2 cols) */}
          <SpotlightCard
            delay={0.1}
            enableTilt={true}
            onMouseEnter={() => ambientAudio.playInteractiveHover()}
            className="md:col-span-2 glass-chrome-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 border border-slate-200/90"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                    <img
                      src={PERSONAL_INFO.avatar}
                      alt={PERSONAL_INFO.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono font-semibold">
                    About Me
                  </span>
                </div>
                <Sparkle size={16} weight="fill" className="text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {PERSONAL_INFO.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {PERSONAL_INFO.bio}
              </p>
            </div>

            {/* Aluminum Tag Pills with Spring Hover */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
              {PERSONAL_INFO.interests.map((interest, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="px-3 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 text-xs font-mono font-medium text-slate-700 transition-colors cursor-default"
                >
                  #{interest}
                </motion.span>
              ))}
            </div>
          </SpotlightCard>

          {/* Quick Metrics / Stats Card with Animated Counter */}
          <SpotlightCard
            delay={0.2}
            enableTilt={true}
            onMouseEnter={() => ambientAudio.playInteractiveHover()}
            className="glass-chrome-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border border-slate-200/90 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold">
                Telemetry
              </span>
              <Trophy size={16} weight="bold" className="text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {PERSONAL_INFO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col transition-transform duration-300 hover:scale-[1.02]"
                >
                  <AnimatedCounter
                    value={stat.value}
                    className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight"
                  />
                  <span className="text-[11px] text-slate-500 font-medium leading-tight mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
              <Terminal size={14} weight="bold" />
              <span>Full-Stack Verified</span>
            </div>
          </SpotlightCard>

          {/* Value Proposition 1 */}
          <SpotlightCard
            delay={0.25}
            enableTilt={true}
            onMouseEnter={() => ambientAudio.playInteractiveHover()}
            className="glass-chrome-card rounded-3xl p-6 space-y-3 border border-slate-200/90 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
              <Code size={20} weight="bold" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Scalable Systems</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Robust backend foundations, zero-latency state synchronization, and resilient cloud deployments.
            </p>
          </SpotlightCard>

          {/* Value Proposition 2 */}
          <SpotlightCard
            delay={0.3}
            enableTilt={true}
            onMouseEnter={() => ambientAudio.playInteractiveHover()}
            className="glass-chrome-card rounded-3xl p-6 space-y-3 border border-slate-200/90 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkle size={20} weight="bold" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Spatial & 3D Web</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Procedural WebGL shaders, Three.js spatial environments, and Awwwards-grade tactile responsiveness.
            </p>
          </SpotlightCard>

          {/* Value Proposition 3 */}
          <SpotlightCard
            delay={0.35}
            enableTilt={true}
            onMouseEnter={() => ambientAudio.playInteractiveHover()}
            className="glass-chrome-card rounded-3xl p-6 space-y-3 border border-slate-200/90 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
              <Handshake size={20} weight="bold" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Product Craftsmanship</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Obsession with micro-interactions, 60fps budget management, and accessibility standards.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
