import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SpeakerHigh, SpeakerSlash, ArrowUpRight } from '@phosphor-icons/react';
import { ambientAudio } from '../../audio/AmbientAudio';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { Magnetic } from './Magnetic';

export const LiquidHeader: React.FC = () => {
  const isAudioPlaying = usePortfolioStore((s) => s.isAudioPlaying);
  const toggleAudio = usePortfolioStore((s) => s.toggleAudio);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track global scroll progress for header progress track
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
      const current = sections.find((sec) => {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    ambientAudio.playInteractiveHover();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-2 sm:px-6 py-3 sm:py-4 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto relative flex items-center justify-between gap-1.5 sm:gap-8 px-2.5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 max-w-full overflow-hidden ${
          scrolled
            ? 'glass-chrome-pill shadow-lg shadow-black/5 bg-white/90'
            : 'bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm'
        }`}
      >
        {/* Subtle Scroll Story Progress Track at Top of Pill */}
        <motion.div
          className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-slate-900 to-transparent rounded-full origin-left pointer-events-none opacity-60"
          style={{ scaleX: smoothProgress }}
        />

        {/* Left: Brand Identity & Live Status */}
        <Magnetic distance={6}>
          <div
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-slate-200 shadow-md group-hover:scale-105 transition-transform bg-slate-900 shrink-0">
              <img
                src={PERSONAL_INFO.avatar}
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold tracking-tight text-slate-900 group-hover:text-black transition-colors">
                Mushfiq
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Available</span>
              </div>
            </div>
          </div>
        </Magnetic>

        {/* Center: Navigation Links with Animated Layout Pill Slider */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 relative shrink">
          {[
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'experience', label: 'Exp.' },
            { id: 'projects', label: 'Works' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-600 hover:text-black hover:bg-black/5'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="header-active-pill"
                    className="absolute inset-0 bg-black rounded-full shadow-sm z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Audio Synthesizer & CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio Synthesizer Toggle */}
          <Magnetic distance={6}>
            <button
              onClick={() => {
                toggleAudio();
                ambientAudio.playInteractiveHover();
              }}
              title={isAudioPlaying ? 'Mute Ambient Audio' : 'Play Ambient Audio'}
              className={`p-1.5 sm:p-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white/80 text-slate-600 border-slate-200 hover:text-black hover:border-slate-400'
              }`}
            >
              {isAudioPlaying ? (
                <SpeakerHigh size={15} weight="bold" className="animate-pulse" />
              ) : (
                <SpeakerSlash size={15} weight="bold" />
              )}
            </button>
          </Magnetic>

          {/* Quick Contact CTA */}
          <Magnetic distance={8}>
            <button
              onClick={() => scrollTo('contact')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={14} weight="bold" />
            </button>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
};
