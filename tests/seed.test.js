import test from 'node:test';
import assert from 'node:assert/strict';

import { SeededRNG } from '../src/game/SeededRNG.js';
import { getRandomUpgrades, applyUpgrade } from '../src/game/UpgradeSystem.js';

test('SeededRNG matches deterministic sequence', () => {
  const a = new SeededRNG(101);
  const b = new SeededRNG(101);

  const valuesA = Array.from({ length: 12 }, () => a.random());
  const valuesB = Array.from({ length: 12 }, () => b.random());

  assert.deepEqual(valuesA, valuesB);
  assert.ok(valuesA.every((value) => value >= 0 && value <= 1));
});

test('Upgrade choices are unique and apply to the player', () => {
  const player = {
    upgrades: [],
    sparkCount: 1,
    shootDelay: 0.22,
    sparkDamage: 12,
    sparkRadius: 5,
    lanternRadius: 220,
    speed: 210,
    gemHealing: 0,
    maxHealth: 100,
    health: 100,
    piercing: 0,
    flareRate: 0
  };

  const options = getRandomUpgrades([], 3, () => 0.2);
  assert.equal(options.length, 3);
  assert.equal(new Set(options.map((option) => option.id)).size, 3);

  applyUpgrade(player, 'twinSpark');
  applyUpgrade(player, 'heavyFlame');

  assert.equal(player.sparkCount, 2);
  assert.ok(player.sparkDamage > 12);
  assert.ok(player.upgrades.includes('twinSpark'));
});
