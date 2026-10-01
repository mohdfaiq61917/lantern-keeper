import { clamp } from '../config.js';
import { Spark } from './Spark.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 210;
    this.lanternRadius = 220;
    this.sparkDamage = 12;
    this.sparkRadius = 5;
    this.sparkSpeed = 430;
    this.sparkCount = 1;
    this.piercing = 0;
    this.gemHealing = 0;
    this.flareRate = 0;
    this.maxHealth = 100;
    this.health = 100;
    this.dash = 0;
    this.upgrades = [];
    this.shootDelay = 0.22;
    this.cooldown = 0;
    this.hitFlash = 0;
  }

  update(dt, input, enemies, bullets) {
    const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const moveY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const mag = Math.hypot(moveX, moveY) || 1;

    this.x += ((moveX / mag) * this.speed * dt);
    this.y += ((moveY / mag) * this.speed * dt);
    this.x = clamp(this.x, 0, 2400);
    this.y = clamp(this.y, 0, 2400);

    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      const target = this.getNearestEnemy(enemies);
      if (target) {
        this.fireAt(target, bullets);
      }
      this.cooldown = this.shootDelay;
    }

    if (this.flareRate > 0 && Math.random() < this.flareRate * dt * 2.5) {
      for (let i = 0; i < 3; i += 1) {
        const angle = (Math.PI * 2 * i) / 3 + Math.random() * 0.7;
        bullets.push(new Spark(this.x, this.y, Math.cos(angle) * this.sparkSpeed, Math.sin(angle) * this.sparkSpeed, this.sparkDamage * 0.9, this.sparkRadius + 1, 0.7));
      }
    }

    this.hitFlash = Math.max(0, this.hitFlash - dt * 2.5);
  }

  getNearestEnemy(enemies) {
    let best = null;
    let bestDist = Infinity;
    for (const enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.lanternRadius && dist < bestDist) {
        best = enemy;
        bestDist = dist;
      }
    }
    return best;
  }

  fireAt(target, bullets) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const angle = Math.atan2(dy, dx);

    for (let i = 0; i < this.sparkCount; i += 1) {
      const offset = (i - (this.sparkCount - 1) / 2) * 0.16;
      const vx = Math.cos(angle + offset) * this.sparkSpeed;
      const vy = Math.sin(angle + offset) * this.sparkSpeed;
      const spark = new Spark(this.x, this.y, vx, vy, this.sparkDamage, this.sparkRadius, 1.1);
      spark.pierce = this.piercing;
      bullets.push(spark);
    }
  }

  draw(ctx) {
    const color = this.hitFlash > 0 ? '#fff6d8' : '#7ae7ff';
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#dff5ff';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(122, 231, 255, 0.1)';
    ctx.arc(this.x, this.y, this.lanternRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
