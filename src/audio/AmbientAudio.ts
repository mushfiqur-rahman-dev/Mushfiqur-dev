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

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Smooth master fade-in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.75, this.ctx.currentTime + 2.5);

    this.playAmbientChordLoop();
    this.scheduleWindChimes();
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    this.isPlaying = false;

    // Smooth master fade-out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    if (this.chimeTimer) window.clearTimeout(this.chimeTimer);
    if (this.padTimer) window.clearTimeout(this.padTimer);
  }

  public setVolume(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, clamped * 0.8), this.ctx.currentTime);
  }

  private playAmbientChordLoop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
    const duration = 7.5; // seconds per chord swell

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm analog tone
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle stereo detuning for rich chorus vibe
      osc.detune.setValueAtTime((idx - 1.5) * 6, this.ctx.currentTime);

      // Lowpass filter tuned for phone speakers & headphone richness
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200 + idx * 180, this.ctx.currentTime);

      // Smooth volume envelope: slow swell, sustain, soft fade
      const t = this.ctx.currentTime;
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
      this.playAmbientChordLoop();
    }, (duration - 1.5) * 1000);
  }

  private scheduleWindChimes() {
    if (!this.isPlaying || !this.ctx) return;

    // Trigger random pentatonic bell tone every 2.5 - 5 seconds
    const delay = 2500 + Math.random() * 3000;
    this.chimeTimer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.playSingleChime();
        this.scheduleWindChimes();
      }
    }, delay);
  }

  private playSingleChime() {
    if (!this.ctx || !this.masterGain) return;

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
    if (!this.ctx || !this.masterGain) return;
    this.initContext();

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
    if (!this.ctx || !this.masterGain) return;
    this.initContext();

    // Two-note crystal arpeggio for modal slide-in
    const chords = [587.33, 880.00]; // D5, A5
    chords.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
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
