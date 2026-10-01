import { CONFIG, clamp } from '../config.js';
import { SeededRNG } from './SeededRNG.js';
import { UPGRADE_CATALOG, getRandomUpgrades, applyUpgrade } from './UpgradeSystem.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Gem } from '../entities/Gem.js';
import { Spark } from '../entities/Spark.js';
import { AudioSystem } from '../audio/AudioSystem.js';
import { Spawner } from '../systems/Spawner.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { safeStorageGet, safeStorageSet } from './Progress.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lastFrame = 0;
    this.state = 'playing';
    this.elapsed = 0;
    this.score = 0;
    this.mode = 'survival';
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 18;
    this.rng = new SeededRNG(1);
    this.audio = new AudioSystem();
    this.audio.init();

    this.cameraX = 0;
    this.cameraY = 0;
    this.screenShake = 0;

    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      pointerX: 0,
      pointerY: 0,
      pointerActive: false
    };

    this.enemies = [];
    this.gems = [];
    this.sparks = [];
    this.effects = [];
    this.pendingUpgrades = [];
    this.upgradeOpen = false;

    this.player = new Player(CONFIG.worldWidth / 2, CONFIG.worldHeight / 2);
    this.spawner = new Spawner(this, this.rng);
    this.collision = new CollisionSystem(this);
    this.highScore = safeStorageGet('lantern-keeper-best', 0) ?? 0;

    this.bindInput();
    this.resize();
    this.startRun();
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.input.up = true;
      if (key === 's' || key === 'arrowdown') this.input.down = true;
      if (key === 'a' || key === 'arrowleft') this.input.left = true;
      if (key === 'd' || key === 'arrowright') this.input.right = true;
      if (key === 'escape') {
        if (this.state === 'paused') this.state = 'playing';
        else if (this.state === 'playing') this.state = 'paused';
      }
      if (this.upgradeOpen && ['1', '2', '3'].includes(key)) {
        const index = Number(key) - 1;
        if (this.pendingUpgrades[index]) {
          this.chooseUpgrade(index);
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.input.up = false;
      if (key === 's' || key === 'arrowdown') this.input.down = false;
      if (key === 'a' || key === 'arrowleft') this.input.left = false;
      if (key === 'd' || key === 'arrowright') this.input.right = false;
    });

    window.addEventListener('pointermove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.input.pointerX = ((event.clientX - rect.left) / rect.width) * this.canvas.width;
      this.input.pointerY = ((event.clientY - rect.top) / rect.height) * this.canvas.height;
      this.input.pointerActive = true;
    });

    window.addEventListener('pointerdown', () => {
      this.audio.init();
      this.audio.setVolume(CONFIG.masterVolume);
    });
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  startRun() {
    this.player = new Player(CONFIG.worldWidth / 2, CONFIG.worldHeight / 2);
    this.enemies = [];
    this.gems = [];
    this.sparks = [];
    this.effects = [];
    this.score = 0;
    this.elapsed = 0;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = 18;
    this.state = 'playing';
    this.pendingUpgrades = [];
    this.upgradeOpen = false;
    this.cameraX = this.player.x;
    this.cameraY = this.player.y;
  }

  spawnEnemy(type = null) {
    const choice = type || ['chaser', 'swarmer', 'tank', 'shooter'][Math.floor(Math.random() * 4)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 700;
    const x = this.player.x + Math.cos(angle) * distance;
    const y = this.player.y + Math.sin(angle) * distance;
    this.enemies.push(new Enemy(choice, x, y));
  }

  spawnGem(x, y, value = 1) {
    this.gems.push(new Gem(x, y, value));
  }

  chooseUpgrade(index) {
    const upgrade = this.pendingUpgrades[index];
    if (!upgrade) return;
    applyUpgrade(this.player, upgrade.id);
    this.pendingUpgrades = [];
    this.upgradeOpen = false;
    this.state = 'playing';
    this.audio.levelUp();
  }

  triggerUpgrade() {
    this.upgradeOpen = true;
    this.pendingUpgrades = getRandomUpgrades(this.player.upgrades, 3);
    this.state = 'upgrade';
  }

  update(dt) {
    if (this.state === 'paused' || this.state === 'upgrade') return;

    this.elapsed += dt;
    this.player.update(dt, this.input, this.enemies, this.sparks);
    this.spawner.update(dt);

    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      const shot = enemy.update(dt, this.player);
      if (shot) {
        const speed = 220;
        this.sparks.push({
          x: shot.x,
          y: shot.y,
          vx: shot.dx * speed,
          vy: shot.dy * speed,
          radius: 5,
          life: 2,
          damage: 7,
          dead: false,
          tint: '#9ae6b4'
        });
      }
    }

    this.collision.update(dt);

    for (let i = this.sparks.length - 1; i >= 0; i -= 1) {
      const spark = this.sparks[i];
      if (spark.dead) {
        this.sparks.splice(i, 1);
        continue;
      }
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.life -= dt;
      if (spark.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    this.cameraX += (this.player.x - this.cameraX) * 0.08;
    this.cameraY += (this.player.y - this.cameraY) * 0.08;

    const danger = Math.min(1, this.elapsed / 60);
    this.audio.updateIntensity(danger);

    if (this.player.health <= 0) {
      this.highScore = Math.max(this.highScore, this.score);
      safeStorageSet('lantern-keeper-best', this.highScore);
      this.state = 'gameover';
    }

    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level += 1;
      this.xpToNext = Math.floor(this.xpToNext * 1.3) + 8;
      this.triggerUpgrade();
      break;
    }
  }

  draw() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = '#050b12';
    this.ctx.fillRect(0, 0, width, height);

    const offsetX = width / 2 - this.cameraX;
    const offsetY = height / 2 - this.cameraY;

    this.ctx.save();
    this.ctx.translate(offsetX, offsetY);

    const glow = this.ctx.createRadialGradient(
      this.player.x,
      this.player.y,
      10,
      this.player.x,
      this.player.y,
      this.player.lanternRadius * 1.2
    );
    glow.addColorStop(0, 'rgba(122, 231, 255, 0.42)');
    glow.addColorStop(0.55, 'rgba(122, 231, 255, 0.1)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = glow;
    this.ctx.fillRect(this.player.x - this.player.lanternRadius - 120, this.player.y - this.player.lanternRadius - 120, this.player.lanternRadius * 2 + 240, this.player.lanternRadius * 2 + 240);

    for (const gem of this.gems) gem.draw(this.ctx);
    for (const spark of this.sparks) {
      if (spark && typeof spark.draw === 'function') spark.draw(this.ctx);
    }
    for (const enemy of this.enemies) enemy.draw(this.ctx);
    this.player.draw(this.ctx);

    this.ctx.restore();

    this.drawHud(width, height);

    if (this.upgradeOpen) {
      this.drawUpgradeScreen(width, height);
    }

    if (this.state === 'paused') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '28px sans-serif';
      this.ctx.fillText('Paused', width / 2 - 42, height / 2);
    }

    if (this.state === 'gameover') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '30px sans-serif';
      this.ctx.fillText('Run Over', width / 2 - 64, height / 2 - 20);
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText(`Score: ${this.score}`, width / 2 - 44, height / 2 + 18);
      this.ctx.fillText('Press R to restart', width / 2 - 72, height / 2 + 52);
    }
  }

  drawHud(width, height) {
    const health = this.player.health / this.player.maxHealth;
    this.ctx.fillStyle = 'rgba(8, 12, 19, 0.74)';
    this.ctx.fillRect(20, 20, 220, 18);
    this.ctx.fillStyle = '#5dd3ff';
    this.ctx.fillRect(20, 20, 220 * health, 18);

    this.ctx.fillStyle = '#edf5ff';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(`Health ${Math.ceil(this.player.health)} / ${this.player.maxHealth}`, 20, 54);
    this.ctx.fillText(`Level ${this.level}  XP ${this.xp}/${this.xpToNext}`, 20, 74);
    this.ctx.fillText(`Score ${this.score}`, 20, 94);
    this.ctx.fillText(`Best ${this.highScore}`, width - 120, 24);
  }

  drawUpgradeScreen(width, height) {
    this.ctx.fillStyle = 'rgba(7, 10, 18, 0.8)';
    this.ctx.fillRect(width * 0.12, height * 0.18, width * 0.76, height * 0.6);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '30px sans-serif';
    this.ctx.fillText('Lantern Upgrade', width * 0.15, height * 0.25);

    this.pendingUpgrades.forEach((upgrade, index) => {
      const x = width * 0.18;
      const y = height * 0.32 + index * 120;
      this.ctx.fillStyle = 'rgba(255,255,255,0.08)';
      this.ctx.fillRect(x, y, width * 0.64, 80);
      this.ctx.fillStyle = '#f5d28b';
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText(`${index + 1}. ${upgrade.name}`, x + 18, y + 30);
      this.ctx.fillStyle = '#dfebf8';
      this.ctx.font = '16px sans-serif';
      this.ctx.fillText(upgrade.description, x + 18, y + 58);
    });
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastFrame) / 1000 || 0.016, 0.032);
    this.lastFrame = timestamp;
    if (this.state !== 'upgrade') {
      this.update(dt);
    }
    this.draw();
    requestAnimationFrame((time) => this.loop(time));
  }
}
