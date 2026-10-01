export const CONFIG = {
  worldWidth: 2400,
  worldHeight: 2400,
  palette: {
    none: {
      player: '#7ae7ff',
      enemy: '#ff5d73',
      gem: '#ffd166',
      lantern: '#ffe9b3',
      glow: 'rgba(122, 231, 255, 0.3)'
    }
  },
  masterVolume: 0.28,
  screenShake: 8,
  baseDifficulty: 1
};

export const TAU = Math.PI * 2;

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
