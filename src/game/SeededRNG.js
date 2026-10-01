export class SeededRNG {
  constructor(seed = 1) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state;
  }

  random() {
    return this.next() / 4294967296;
  }

  range(min, max) {
    return min + (max - min) * this.random();
  }

  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
}

export function makeDailySeed() {
  const now = new Date();
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
