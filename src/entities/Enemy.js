export const ENEMY_TYPES = {
  chaser: { radius: 16, speed: 70, damage: 14, color: '#ff5d73' },
  swarmer: { radius: 12, speed: 95, damage: 10, color: '#ffad69' },
  tank: { radius: 22, speed: 42, damage: 20, color: '#a78bfa' },
  shooter: { radius: 14, speed: 55, damage: 9, color: '#a7f3d0' }
};

export class Enemy {
  constructor(type, x, y) {
    const spec = ENEMY_TYPES[type] || ENEMY_TYPES.chaser;
    this.type = type;
    this.x = x;
    this.y = y;
    this.radius = spec.radius;
    this.speed = spec.speed;
    this.damage = spec.damage;
    this.color = spec.color;
    this.health = spec.radius * 3.2;
    this.phase = Math.random() * Math.PI * 2;
    this.fireCooldown = 1.2 + Math.random() * 1.4;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    let tx = 0;
    let ty = 0;

    if (this.type === 'chaser') {
      tx = (dx / dist) * this.speed;
      ty = (dy / dist) * this.speed;
    } else if (this.type === 'swarmer') {
      this.phase += dt * 4;
      tx = (dx / dist) * this.speed + Math.cos(this.phase) * 40;
      ty = (dy / dist) * this.speed + Math.sin(this.phase) * 40;
    } else if (this.type === 'tank') {
      tx = (dx / dist) * this.speed * 0.7;
      ty = (dy / dist) * this.speed * 0.7;
    } else if (this.type === 'shooter') {
      tx = (dx / dist) * this.speed * 0.45;
      ty = (dy / dist) * this.speed * 0.45;
      this.fireCooldown -= dt;
      if (this.fireCooldown <= 0 && dist < 420) {
        this.fireCooldown = 1.8 + Math.random() * 1.2;
        return { x: this.x, y: this.y, dx: dx / dist, dy: dy / dist };
      }
    }

    this.x += tx * dt;
    this.y += ty * dt;
    return null;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
