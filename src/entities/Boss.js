import { Enemy } from './Enemy.js';

export const BOSS_TYPES = {
  duskTitan: {
    id: 'duskTitan',
    name: 'Dusk Titan',
    color: '#c084fc',
    radius: 36,
    speed: 42,
    damage: 22,
    maxHealth: 260,
    pattern: 'orbit'
  },
  ashWraith: {
    id: 'ashWraith',
    name: 'Ash Wraith',
    color: '#ff6b6b',
    radius: 33,
    speed: 58,
    damage: 18,
    maxHealth: 235,
    pattern: 'dash'
  },
  eclipseWarden: {
    id: 'eclipseWarden',
    name: 'Eclipse Warden',
    color: '#7ae7ff',
    radius: 40,
    speed: 35,
    damage: 25,
    maxHealth: 300,
    pattern: 'spread'
  }
};

export class Boss extends Enemy {
  constructor(type, x, y) {
    const def = BOSS_TYPES[type] || BOSS_TYPES.duskTitan;
    super('tank', x, y);
    this.type = type;
    this.bossType = type;
    this.name = def.name;
    this.radius = def.radius;
    this.speed = def.speed;
    this.damage = def.damage;
    this.color = def.color;
    this.maxHealth = def.maxHealth;
    this.health = def.maxHealth;
    this.pattern = def.pattern;
    this.attackCooldown = 1.5;
    this.orbitPhase = 0;
    this.value = 12;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    this.orbitPhase += dt;
    this.attackCooldown -= dt;

    if (this.pattern === 'orbit') {
      const orbit = Math.sin(this.orbitPhase * 2) * 25;
      const nx = (dx / dist) * this.speed * 0.8 + Math.cos(this.orbitPhase) * orbit * 0.08;
      const ny = (dy / dist) * this.speed * 0.8 + Math.sin(this.orbitPhase) * orbit * 0.08;
      this.x += nx * dt;
      this.y += ny * dt;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 2.3;
        return {
          x: this.x,
          y: this.y,
          dx: dx / dist,
          dy: dy / dist,
          burst: 7,
          spread: Math.PI / 6,
          speed: 220
        };
      }
    } else if (this.pattern === 'dash') {
      const nx = (dx / dist) * this.speed;
      const ny = (dy / dist) * this.speed;
      this.x += nx * dt;
      this.y += ny * dt;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 1.5;
        return {
          x: this.x,
          y: this.y,
          dx: dx / dist,
          dy: dy / dist,
          burst: 9,
          spread: Math.PI / 4,
          speed: 250
        };
      }
    } else {
      const nx = (dy / dist) * this.speed * 0.5;
      const ny = (-dx / dist) * this.speed * 0.5;
      this.x += nx * dt;
      this.y += ny * dt;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 2.1;
        return {
          x: this.x,
          y: this.y,
          dx: dx / dist,
          dy: dy / dist,
          burst: 11,
          spread: Math.PI / 3.2,
          speed: 210
        };
      }
    }

    return null;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}
