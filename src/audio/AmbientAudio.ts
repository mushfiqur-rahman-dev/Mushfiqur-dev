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

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.ctx = new AudioCtxClass();

      // Dynamics compressor prevents clipping and boosts perceived loudness on mobile speakers
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

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
  }

  private attachAutoUnlockListeners() {
    if (this.unlockListenersAttached || typeof window === 'undefined') return;
    this.unlockListenersAttached = true;

    const unlockHandler = () => {
      this.initContext();
      if (!this.ctx) return;

      // Play 1-sample silent buffer for iOS Safari & Android Chrome hardware unlock
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch {
        // Fallback
      }

      if (this.ctx.state === 'suspended') {
        this.ctx
          .resume()
          .then(() => {
            if (this.isPlaying) {
              this.startAmbientPlayback();
            }
          })
          .catch(() => {});
      } else if (this.ctx.state === 'running' && this.isPlaying && !this.padTimer) {
        this.startAmbientPlayback();
      }
    };

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'keydown', 'wheel'];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
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
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;

    this.clearTimers();

    // Smooth master fade-in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.75, this.ctx.currentTime + 1.5);

    this.playAmbientChordLoop();
    this.scheduleWindChimes();
  }

  public start() {
    this.isPlaying = true;
    this.initContext();

    if (this.ctx && this.ctx.state === 'running') {
      this.startAmbientPlayback();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.clearTimers();

    if (!this.ctx || !this.masterGain) return;

    // Smooth master fade-out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
  }

  public setVolume(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, clamped * 0.8), this.ctx.currentTime);
  }

  private playAmbientChordLoop() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.masterGain) {
      this.clearTimers();
      return;
    }

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
    const duration = 7.5; // seconds per chord swell
    const t = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

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
      filter.frequency.setValueAtTime(1200 + idx * 180, t);

      // Smooth volume envelope: slow swell, sustain, soft fade
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), t + 2.5);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), t + 5.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

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
      if (this.chimeTimer) {
        window.clearTimeout(this.chimeTimer);
        this.chimeTimer = null;
      }
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
    if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const randomNote = this.notes[Math.floor(Math.random() * this.notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);

    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 3.2);
  }

  public playInteractiveHover() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08);

    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playModalOpen() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;

    // Two-note crystal arpeggio for modal slide-in
    const chords = [587.33, 880.00]; // D5, A5
    chords.forEach((freq, i) => {
      if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      const t = this.ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }
}

export const ambientAudio = new AmbientAudioEngine();
