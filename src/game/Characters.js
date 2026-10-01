export const CHARACTERS = {
  warden: {
    id: 'warden',
    name: 'Lantern Warden',
    ability: 'Lantern Pulse',
    description: 'Balanced keeper with a steady pulse that clears nearby shadows.',
    stats: {
      speed: 210,
      lanternRadius: 220,
      sparkDamage: 12,
      sparkRadius: 5,
      sparkCount: 1,
      maxHealth: 100,
      shootDelay: 0.22
    }
  },
  runner: {
    id: 'runner',
    name: 'Dusk Runner',
    ability: 'Blink Rush',
    description: 'Fast and aggressive, with a short burst dash and extra movement speed.',
    stats: {
      speed: 245,
      lanternRadius: 210,
      sparkDamage: 11,
      sparkRadius: 5,
      sparkCount: 1,
      maxHealth: 92,
      shootDelay: 0.18
    }
  },
  seer: {
    id: 'seer',
    name: 'Ember Seer',
    ability: 'Solar Burst',
    description: 'Controls the battlefield with a wider light cone and stronger pulses.',
    stats: {
      speed: 195,
      lanternRadius: 255,
      sparkDamage: 14,
      sparkRadius: 6,
      sparkCount: 2,
      maxHealth: 108,
      shootDelay: 0.24
    }
  }
};

export function applyCharacterStats(player, characterId = 'warden') {
  const def = CHARACTERS[characterId] || CHARACTERS.warden;
  player.characterId = def.id;
  player.characterName = def.name;
  player.abilityName = def.ability;
  player.speed = def.stats.speed;
  player.lanternRadius = def.stats.lanternRadius;
  player.sparkDamage = def.stats.sparkDamage;
  player.sparkRadius = def.stats.sparkRadius;
  player.sparkCount = def.stats.sparkCount;
  player.maxHealth = def.stats.maxHealth;
  player.health = Math.min(player.health || def.stats.maxHealth, def.stats.maxHealth);
  player.shootDelay = def.stats.shootDelay;
  return def;
}
