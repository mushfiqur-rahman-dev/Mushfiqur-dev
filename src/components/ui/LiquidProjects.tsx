import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkle, CheckCircle, GithubLogo } from '@phosphor-icons/react';
import { PROJECTS } from '../../data/portfolioData';
import { ambientAudio } from '../../audio/AmbientAudio';
import { SpotlightCard } from './SpotlightCard';
import { ScrollStoryReveal } from './ScrollStoryReveal';
import { Magnetic } from './Magnetic';

export const LiquidProjects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | '3d' | 'ai' | 'systems'>('all');

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '3d') return p.tags.includes('Three.js') || p.tags.includes('Canvas API');
    if (activeFilter === 'ai') return p.tags.includes('FastAPI') || p.id === 'lumina-ai';
    if (activeFilter === 'systems') return p.tags.includes('Redis') || p.tags.includes('Ethers.js');
    return true;
  });

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 py-24 z-10"
    >
      <div className="max-w-6xl w-full mx-auto space-y-12">
        {/* Section Header */}
        <ScrollStoryReveal direction="up" className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            Featured <span className="text-chrome-gradient">Creations</span>
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-600">
            A curated selection of high-impact production web applications and experimental architectures.
          </p>

          {/* Filter Pills with Framer Motion layoutId Gliding Slider */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 relative">
            {[
              { id: 'all', label: 'All Works' },
              { id: '3d', label: 'Spatial & 3D' },
              { id: 'ai', label: 'AI & Machine Learning' },
              { id: 'systems', label: 'Distributed Systems' },
            ].map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFilter(f.id as any);
                    ambientAudio.playInteractiveHover();
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-black border border-slate-200 hover:border-slate-400 bg-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-black rounded-full shadow-md z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollStoryReveal>

        {/* Projects Grid with Fluid FLIP Reorganization */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <SpotlightCard
                  enableTilt={true}
                  onMouseEnter={() => ambientAudio.playInteractiveHover()}
                  className="group glass-chrome-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-black/5 transition-shadow duration-300 border border-slate-200/90 h-full"
                >
                  {/* Top Meta Bar */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-700">
                            <Sparkle size={12} weight="fill" />
                            Featured
                          </span>
                        )}
                        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">
                          Case Study
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-black transition-colors pt-1">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-500">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Live / Source Quick Links with Magnetic Interaction */}
                    <div className="flex items-center gap-2">
                      <Magnetic distance={6}>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-700 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
                          title="View Source"
                        >
                          <GithubLogo size={16} weight="bold" />
                        </a>
                      </Magnetic>

                      <Magnetic distance={6}>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full bg-black text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
                          title="Live Demo"
                        >
                          <ArrowUpRight size={16} weight="bold" />
                        </a>
                      </Magnetic>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Performance / Metric Banner */}
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-700 font-medium">
                    <CheckCircle size={15} weight="fill" className="text-emerald-600 shrink-0" />
                    <span>{project.metrics}</span>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 text-[11px] font-mono text-slate-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
