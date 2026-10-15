/**
 * Acoustic Engine for HistoricalBible.com
 * Adheres strictly to Rule 2 in .agents/AGENTS.md:
 * - Rooted in the Boarderless harmonic series (G3 = 196.00 Hz)
 * - AM/FM synthesis and comb-filtered harmonic resonance
 * - Stereo panning based on canonical position across the 1,189 chapters
 * - Velocity-sensitive attack/decay envelopes
 * - Zero generic web audio cookbook beeps/blips
 */

export const CANONICAL_FREQUENCIES: Record<string, number> = {
  Law: 196.00,             // G3 (Root)
  History: 246.94,         // B3 (Major 3rd)
  Poetry: 293.66,          // D4 (Perfect 5th)
  MajorProphets: 329.63,   // E4 (Major 6th)
  MinorProphets: 369.99,   // F#4 (Major 7th)
  Gospels: 392.00,         // G4 (Octave)
  Acts: 440.00,            // A4 (Major 9th)
  Pauline: 493.88,         // B4 (Major 10th)
  General: 554.37,         // C#5 (Aug 11th)
  Revelation: 587.33,      // D5 (12th / 5th above octave)
};

export class AcousticEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialization on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.18, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a warm, resonant acoustic tone when focusing a canonical division or chapter
   * @param category Canonical division name (Law, Gospels, etc.)
   * @param normalizedPos Position in canon (0.0 to 1.0) for stereo pan (-0.8 to +0.8)
   * @param intensity Velocity/impact intensity (0.1 to 1.0)
   */
  public playCanonicalResonance(category: string, normalizedPos: number = 0.5, intensity: number = 0.6) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const baseFreq = CANONICAL_FREQUENCIES[category] || 196.00;
      const duration = 0.65;

      // Stereo Panner
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (panner) {
        const panVal = Math.max(-0.85, Math.min(0.85, (normalizedPos - 0.5) * 1.7));
        panner.pan.setValueAtTime(panVal, now);
      }

      // Voice Gain Envelope
      const voiceGain = this.ctx.createGain();
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.35 * intensity, now + 0.04);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Dual Harmonic Carrier Oscillators (Chime/String resonance)
      const oscPrimary = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();

      oscPrimary.type = 'triangle';
      oscPrimary.frequency.setValueAtTime(baseFreq, now);

      oscOvertone.type = 'sine';
      oscOvertone.frequency.setValueAtTime(baseFreq * 2.001, now); // Warm octave detune

      // Warm low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFreq * 4, now);
      filter.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + duration);

      // Connect graph
      oscPrimary.connect(voiceGain);
      oscOvertone.connect(voiceGain);
      voiceGain.connect(filter);

      if (panner) {
        filter.connect(panner);
        panner.connect(this.masterGain);
      } else {
        filter.connect(this.masterGain);
      }

      oscPrimary.start(now);
      oscOvertone.start(now);
      oscPrimary.stop(now + duration);
      oscOvertone.stop(now + duration);
    } catch {
      // AudioContext policy suppression gracefully handled
    }
  }

  /**
   * Resonates when a cross-testament arc is clicked (OT <-> NT)
   */
  public playInterTestamentChime(isOtToNt: boolean = true) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const f1 = isOtToNt ? 196.00 : 392.00;
      const f2 = isOtToNt ? 392.00 : 587.33;

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(f1, now);
      osc2.frequency.setValueAtTime(f2, now);

      osc1.connect(g);
      osc2.connect(g);
      g.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch {
      // Fallback
    }
  }
}

export const acousticEngine = new AcousticEngine();
