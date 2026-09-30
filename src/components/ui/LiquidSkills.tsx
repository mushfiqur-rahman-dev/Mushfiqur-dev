import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Sparkle, Stack } from '@phosphor-icons/react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { ambientAudio } from '../../audio/AmbientAudio';
import { SpotlightCard } from './SpotlightCard';
import { ScrollStoryReveal } from './ScrollStoryReveal';
import { AnimatedCounter } from './AnimatedCounter';

export const LiquidSkills: React.FC = () => {
  return (
    <section
      id="skills"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-24 z-10"
    >
      <div className="max-w-5xl w-full mx-auto space-y-12">
        {/* Section Header */}
        <ScrollStoryReveal direction="up" className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Skills
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            Technical <span className="text-chrome-gradient">Matrix</span>
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-600">
            A comprehensive overview of production-tested frameworks, cloud infrastructure, and architectural principles.
          </p>
        </ScrollStoryReveal>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SKILL_CATEGORIES.map((category, idx) => (
            <SpotlightCard
              key={idx}
              delay={0.1 * idx}
              enableTilt={true}
              onMouseEnter={() => ambientAudio.playInteractiveHover()}
              className="glass-chrome-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 border border-slate-200/90"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
                    {idx === 0 ? (
                      <Stack size={18} weight="bold" />
                    ) : idx === 1 ? (
                      <Terminal size={18} weight="bold" />
                    ) : (
                      <Sparkle size={18} weight="bold" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Tier 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {category.title}
                </h3>

                <div className="space-y-4 pt-2">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5 group">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 group-hover:text-black transition-colors">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-slate-500">
                          <AnimatedCounter value={`${skill.level}%`} />
                        </span>
                      </div>

                      {/* Liquid Chrome Animated Spring Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: false, amount: 0.2, margin: '-40px 0px -40px 0px' }}
                          transition={{
                            duration: 1.2,
                            delay: 0.12 * sIdx,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 rounded-full relative overflow-hidden"
                        >
                          {/* Ambient shimmer line */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </motion.div>
                      </div>

                      <p className="text-[10px] text-slate-500 font-mono leading-tight">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
