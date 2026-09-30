import { create } from 'zustand';
import type { SectionId } from '../types';
import { MILESTONES } from '../data/portfolioData';

interface PortfolioState {
  scrollProgress: number; // 0.0 to 1.0
  activeSection: SectionId;
  activeModal: SectionId | null;
  modalSide: 'left' | 'right' | 'center' | null;
  isAudioPlaying: boolean;
  isMuted: boolean;
  audioVolume: number;
  isLoading: boolean;
  isStarted: boolean;
  hasInteracted: boolean;

  // Actions
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: SectionId) => void;
  openModal: (section: SectionId, side?: 'left' | 'right' | 'center') => void;
  closeModal: () => void;
  toggleAudio: () => void;
  setAudioPlaying: (playing: boolean) => void;
  setAudioVolume: (vol: number) => void;
  setIsStarted: (started: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  jumpToSection: (sectionId: SectionId) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  scrollProgress: 0.0,
  activeSection: 'hero',
  activeModal: null,
  modalSide: null,
  isAudioPlaying: true,
  isMuted: false,
  audioVolume: 0.8,
  isLoading: true,
  isStarted: false,
  hasInteracted: false,

  setScrollProgress: (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));

    // Automatically determine active section based on proximity to milestones
    let closest = MILESTONES[0];
    let minDiff = 1000;

    for (const m of MILESTONES) {
      const diff = Math.abs(m.progress - clamped);
      if (diff < minDiff) {
        minDiff = diff;
        closest = m;
      }
    }

    set({
      scrollProgress: clamped,
      activeSection: closest.id,
    });
  },

  setActiveSection: (section: SectionId) => {
    set({ activeSection: section });
  },

  openModal: (section: SectionId, side) => {
    const milestone = MILESTONES.find((m) => m.id === section);
    const determinedSide = side || milestone?.side || 'left';
    set({
      activeModal: section,
      modalSide: determinedSide,
      hasInteracted: true,
    });
  },

  closeModal: () => {
    set({ activeModal: null, modalSide: null });
  },

  toggleAudio: () => {
    set((state) => ({ isAudioPlaying: !state.isAudioPlaying }));
  },

  setAudioPlaying: (playing: boolean) => {
    set({ isAudioPlaying: playing });
  },

  setAudioVolume: (vol: number) => {
    set({ audioVolume: Math.max(0, Math.min(1, vol)) });
  },

  setIsStarted: (started: boolean) => {
    set({ isStarted: started, isAudioPlaying: started });
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  jumpToSection: (sectionId: SectionId) => {
    const milestone = MILESTONES.find((m) => m.id === sectionId);
    if (milestone) {
      get().setScrollProgress(milestone.progress);
      if (sectionId !== 'hero') {
        get().openModal(sectionId, milestone.side);
      } else {
        get().closeModal();
      }
    }
  },
}));
