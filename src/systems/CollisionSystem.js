export class CollisionSystem {
  constructor(game) {
    this.game = game;
  }

  update(dt) {
    const { player, enemies, sparks, gems } = this.game;

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i];
      if (spark.dead) continue;
      spark.update(dt);

      for (let j = enemies.length - 1; j >= 0; j -= 1) {
        const enemy = enemies[j];
        const dx = spark.x - enemy.x;
        const dy = spark.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist < spark.radius + enemy.radius) {
          enemy.health -= spark.damage;
          spark.life -= 0.12;
          if (spark.pierce <= 0) {
            spark.dead = true;
          } else {
            spark.pierce -= 1;
          }
          if (enemy.health <= 0) {
            enemies.splice(j, 1);
            this.game.score += 25;
            this.game.xp += 1;
            this.game.spawnGem(enemy.x, enemy.y, 1);
          }
          break;
        }
      }
    }

    for (let i = gems.length - 1; i >= 0; i -= 1) {
      const gem = gems[i];
      if (gem.dead) {
        gems.splice(i, 1);
        continue;
      }
      gem.update(dt);
      const dx = gem.x - player.x;
      const dy = gem.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < gem.radius + player.radius + 4) {
        gems.splice(i, 1);
        this.game.xp += gem.value;
        player.health = Math.min(player.maxHealth, player.health + player.gemHealing + 0.5);
        this.game.score += 10;
      }
    }

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const enemy = enemies[i];
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < enemy.radius + player.radius) {
        player.hitFlash = 1;
        player.health -= enemy.damage * dt * 8;
      }
    }
  }
}
