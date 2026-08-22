// Campus Sentinel AI - Synthesized Web Audio Notification Service
// Generates realistic tactical alert tones, siren warbles, and system chimes using Web Audio API

class AudioNotificationService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Play tactical double chime for normal alert
  playAlertChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio chime prevented by browser policy", e);
    }
  }

  // Play Level-1 Emergency siren burst
  playEmergencySiren() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      // Siren frequency modulation (900Hz -> 1400Hz -> 900Hz)
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.linearRampToValueAtTime(1350, now + 0.3);
      osc.frequency.linearRampToValueAtTime(850, now + 0.6);
      osc.frequency.linearRampToValueAtTime(1350, now + 0.9);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      console.warn("Emergency siren audio error", e);
    }
  }

  // Play Route Change / Warning tone
  playWarningTone() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(440, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Warning tone error", e);
    }
  }
}

export const audioService = new AudioNotificationService();
