/**
 * Procedural Web Audio API Soundscape & Interactive SFX Generator
 * High-fidelity, zero-latency ambient audio loop with pentatonic chimes,
 * warm analog chord pads, dynamics compressor, and tactile UI click feedback.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private chimeTimer: number | null = null;
  private padTimer: number | null = null;
  private unlockListenersAttached = false;

  // Peaceful pentatonic scale frequencies (Hz) for serene atmosphere
  private readonly notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ];

  // Warm chord progressions for atmospheric background pad
  private readonly chordProgressions = [
    [130.81, 196.00, 261.63, 329.63], // C major 7th / add9
    [174.61, 261.63, 329.63, 392.00], // F maj7
    [146.83, 220.00, 261.63, 349.23], // Dm7
    [196.00, 246.94, 293.66, 392.00], // G sus
  ];

  private currentChordIndex = 0;

  constructor() {
    this.attachAutoUnlockListeners();
  }

  private ensureContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      this.ctx = new AudioCtxClass();

      // Dynamics compressor prevents clipping and boosts perceived loudness on mobile speakers
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Listen for browser audio state changes (e.g. unlocked by user gesture)
      this.ctx.onstatechange = () => {
        if (this.ctx?.state === 'running' && this.isPlaying) {
          this.startAmbientPlayback();
        }
      };
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private attachAutoUnlockListeners() {
    if (this.unlockListenersAttached || typeof window === 'undefined') return;
    this.unlockListenersAttached = true;

    const unlockHandler = () => {
      this.unlock();
    };

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'keydown', 'wheel'];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
      document.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
  }

  public unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Hardware sound pipeline activation (plays 1-sample silent oscillator)
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(ctx.currentTime + 0.01);
    } catch {
      // Fallback
    }

    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          if (this.isPlaying) {
            this.startAmbientPlayback();
          }
        })
        .catch(() => {});
    } else if (ctx.state === 'running' && this.isPlaying && !this.padTimer) {
      this.startAmbientPlayback();
    }
  }

  private clearTimers() {
    if (this.chimeTimer) {
      window.clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.padTimer) {
      window.clearTimeout(this.padTimer);
      this.padTimer = null;
    }
  }

  private startAmbientPlayback() {
    const ctx = this.ensureContext();
    if (!this.isPlaying || !ctx || ctx.state !== 'running' || !this.masterGain) return;

    this.clearTimers();

    // Smooth master fade-in using rock-solid setTargetAtTime
    this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(0.8, ctx.currentTime, 0.4);

    this.playAmbientChordLoop();
    this.scheduleWindChimes();
  }

  public start() {
    this.isPlaying = true;
    const ctx = this.ensureContext();

    if (ctx && ctx.state === 'running') {
      this.startAmbientPlayback();
    } else {
      this.unlock();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.clearTimers();

    if (!this.ctx || !this.masterGain) return;

    // Smooth master fade-out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
  }

  public setVolume(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(Math.max(0.0001, clamped * 0.8), this.ctx.currentTime, 0.1);
  }

  private playAmbientChordLoop() {
    const ctx = this.ctx;
    if (!this.isPlaying || !ctx || ctx.state !== 'running' || !this.masterGain) {
      return;
    }

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
    const duration = 7.5; // seconds per chord swell
    const t = ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm analog tone
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle stereo detuning for rich chorus vibe
      osc.detune.setValueAtTime((idx - 1.5) * 6, t);

      // Lowpass filter tuned for phone speakers & headphone richness
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400 + idx * 200, t);

      // Smooth volume envelope: slow swell, sustain, soft fade using setTargetAtTime
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.setTargetAtTime(0.18 / (idx + 1), t, 0.6);
      gain.gain.setTargetAtTime(0.0001, t + 4.8, 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + duration);
    });

    this.padTimer = window.setTimeout(() => {
      this.padTimer = null;
      if (this.isPlaying && this.ctx?.state === 'running') {
        this.playAmbientChordLoop();
      }
    }, (duration - 1.5) * 1000);
  }

  private scheduleWindChimes() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') {
      return;
    }

    // Trigger random pentatonic bell tone every 2.5 - 5 seconds
    const delay = 2500 + Math.random() * 3000;
    this.chimeTimer = window.setTimeout(() => {
      this.chimeTimer = null;
      if (this.isPlaying && this.ctx?.state === 'running') {
        this.playSingleChime();
        this.scheduleWindChimes();
      }
    }, delay);
  }

  private playSingleChime() {
    const ctx = this.ctx;
    if (!this.isPlaying || !ctx || ctx.state !== 'running' || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const randomNote = this.notes[Math.floor(Math.random() * this.notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(randomNote, ctx.currentTime);

    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.setTargetAtTime(0.0001, t + 0.05, 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 3.0);
  }

  public playInteractiveHover() {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running' || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);

    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.setTargetAtTime(0.0001, t + 0.02, 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playModalOpen() {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running' || !this.masterGain) return;

    // Two-note crystal arpeggio for modal slide-in
    const chords = [587.33, 880.00]; // D5, A5
    chords.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      const t = this.ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.setTargetAtTime(0.0001, t + 0.04, 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }
}

export const ambientAudio = new AmbientAudioEngine();
