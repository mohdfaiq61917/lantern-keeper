export class Spark {
  constructor(x, y, vx, vy, damage, radius = 5, life = 1.2) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.radius = radius;
    this.life = life;
    this.dead = false;
    this.tint = '#ffe9b3';
    this.pierce = 0;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.tint;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
