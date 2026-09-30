import React, { useEffect, useState } from 'react';
import { LiquidChromeCanvas } from './components/scene/LiquidChromeCanvas';
import { LiquidHeader } from './components/ui/LiquidHeader';
import { LiquidHero } from './components/ui/LiquidHero';
import { LiquidAbout } from './components/ui/LiquidAbout';
import { LiquidProjects } from './components/ui/LiquidProjects';
import { LiquidSkills } from './components/ui/LiquidSkills';
import { LiquidExperience } from './components/ui/LiquidExperience';
import { LiquidContact } from './components/ui/LiquidContact';
import { LiquidPreloader } from './components/ui/LiquidPreloader';
import { ambientAudio } from './audio/AmbientAudio';
import { usePortfolioStore } from './store/usePortfolioStore';

export const App: React.FC = () => {
  const isAudioPlaying = usePortfolioStore((s) => s.isAudioPlaying);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  // Sync ambient audio with global store & autoplay on first interaction
  useEffect(() => {
    if (isAudioPlaying) {
      ambientAudio.start();
    } else {
      ambientAudio.stop();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    const handleFirstGesture = () => {
      if (usePortfolioStore.getState().isAudioPlaying) {
        ambientAudio.start();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* 0. Luxury Spatial Studio Preloader Screen */}
      {isPreloaderVisible && (
        <LiquidPreloader onComplete={() => setIsPreloaderVisible(false)} />
      )}

      {/* 1. Real-Time Procedural 3D Liquid Chrome Canvas */}
      <LiquidChromeCanvas />

      {/* 2. Sleek Floating Navigation Pill */}
      <LiquidHeader />

      {/* 3. High-Contrast Luxury Minimalist Sections */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Hero Section (Replicating Liquid Chrome template) */}
        <LiquidHero />

        {/* Bento About & Telemetry */}
        <LiquidAbout />

        {/* Technical Capabilities Matrix */}
        <LiquidSkills />

        {/* Career Timeline */}
        <LiquidExperience />

        {/* Selected Works Grid */}
        <LiquidProjects />

        {/* Interactive Contact & Transmission */}
        <LiquidContact />
      </div>
    </main>
  );
};

export default App;
