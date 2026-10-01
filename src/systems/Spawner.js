export class Spawner {
  constructor(game, rng) {
    this.game = game;
    this.rng = rng;
    this.timer = 1.2;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      const typeRoll = this.rng.random();
      let type = 'chaser';
      if (typeRoll > 0.8) type = 'swarmer';
      if (typeRoll > 0.9) type = 'tank';
      if (typeRoll > 0.96) type = 'shooter';
      this.game.spawnEnemy(type);
      this.timer = Math.max(0.45, 1.45 - this.game.level * 0.08 + Math.random() * 0.3);
    }
  }
}
