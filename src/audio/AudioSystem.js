export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.initialized = false;
    this.enabled = false;
    this.danger = 0;
  }

  init() {
    if (this.initialized) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.001;
    this.master.connect(this.ctx.destination);
    this.initialized = true;
    this.enabled = true;
  }

  setVolume(value) {
    if (!this.ctx || !this.master) return;
    this.master.gain.value = value * 0.25;
  }

  updateIntensity(level) {
    this.danger = level;
    if (!this.ctx || !this.master) return;
    const target = 0.04 + level * 0.18;
    this.master.gain.value += (target - this.master.gain.value) * 0.04;
    if (Math.random() < 0.1 + level * 0.18) {
      this.playTone(110 + level * 260, 0.06, 'triangle', 0.02 + level * 0.03);
    }
  }

  playTone(frequency, duration, type = 'sawtooth', volume = 0.03) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(this.master);
    const start = this.ctx.currentTime;
    osc.start(start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.stop(start + duration);
  }

  shoot() {
    this.playTone(280 + Math.random() * 100, 0.04, 'square', 0.015);
  }

  hit() {
    this.playTone(90, 0.07, 'triangle', 0.02);
  }

  levelUp() {
    this.playTone(420, 0.12, 'sawtooth', 0.045);
    this.playTone(560, 0.14, 'triangle', 0.03);
  }
}
