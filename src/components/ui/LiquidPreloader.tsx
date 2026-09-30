import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pulse } from '@phosphor-icons/react';
import { ambientAudio } from '../../audio/AmbientAudio';

interface LiquidPreloaderProps {
  onComplete: () => void;
}

const STATUS_LOGS = [
  'INITIALIZING SPATIAL CORE...',
  'COMPILING RAYMARCHING SDF SHADERS...',
  'CALIBRATING 3D AUDIO SYNTHESIZER...',
  'OPTIMIZING PROCEDURAL FLUID BUFFERS...',
  'SYSTEM READY',
];

export const LiquidPreloader: React.FC<LiquidPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // High-precision smooth cubic progression (total ~1.8s)
    const startTime = performance.now();
    const duration = 1800; // ms
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Smooth ease-out cubic curve
      const easedT = 1 - Math.pow(1 - t, 2.2);
      const currentProgress = Math.min(100, Math.round(easedT * 100));

      setProgress(currentProgress);

      // Status message progression
      const currentStatusIdx = Math.min(
        STATUS_LOGS.length - 1,
        Math.floor((currentProgress / 100) * STATUS_LOGS.length)
      );
      setStatusIndex(currentStatusIdx);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsFinished(true);
          try {
            ambientAudio.unlock();
            ambientAudio.playModalOpen();
          } catch {
            // Audio policy fallback
          }
          setTimeout(() => {
            onComplete();
          }, 900); // Wait for exit animation
        }, 250);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="liquid-preloader"
          onClick={() => ambientAudio.unlock()}
          onTouchStart={() => ambientAudio.unlock()}
          onPointerDown={() => ambientAudio.unlock()}
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: '-100%',
            opacity: 0.95,
            transition: {
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-center items-center bg-[#090a0f] text-white px-6 py-12 select-none overflow-hidden"
        >
          {/* Subtle Studio Dot Matrix Backdrop */}
          <div className="absolute inset-0 bg-dot-pattern opacity-15 pointer-events-none" />

          {/* Central Soft Ambient Faded Light Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-[110px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.08] blur-[70px] rounded-full pointer-events-none" />

          {/* Seamless Center Content */}
          <div className="relative max-w-md w-full flex flex-col items-center text-center z-10 space-y-7 my-auto">
            {/* Typography Brand Title */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.25)]"
              >
                Mushfiq <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Visions</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xs font-mono text-slate-300 tracking-widest uppercase"
              >
                Spatial Systems & Web Architecture
              </motion.p>
            </div>

            {/* Big High-Precision Numeric Counter */}
            <div className="space-y-4 w-full max-w-sm pt-4">
              <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tighter text-white select-none drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)]">
                {progress.toString().padStart(3, '0')}
                <span className="text-3xl sm:text-4xl text-slate-400 font-normal ml-1">%</span>
              </div>

              {/* Sleek Liquid Chrome Progress Track */}
              <div className="w-full h-2 sm:h-2.5 bg-white/[0.08] rounded-full border border-white/20 relative overflow-hidden backdrop-blur-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                {/* Active Liquid Chrome Progress Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-100 rounded-full relative overflow-hidden transition-[width] duration-150 ease-out shadow-[0_0_16px_rgba(255,255,255,0.85)]"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing Leading Head Light */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] shadow-[0_0_8px_#ffffff]" />
                  {/* Specular Shimmer Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </motion.div>
              </div>

              {/* Minimal Status Message Line */}
              <div className="h-6 flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
                <Pulse size={14} className="text-emerald-400 animate-pulse shrink-0" />
                <span className="tracking-wider">{STATUS_LOGS[statusIndex]}</span>
              </div>
            </div>
          </div>

          {/* Minimal Bottom Subtle Tag */}
          <div className="absolute bottom-8 text-[11px] font-mono text-slate-400 z-10 tracking-widest uppercase">
            © {new Date().getFullYear()} MUSHFIQ • SPATIAL CORE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
