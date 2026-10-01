export const UPGRADE_CATALOG = [
  {
    id: 'twinSpark',
    name: 'Twin Spark',
    description: 'Fire a second identical spark with each shot.',
    apply: (player) => {
      player.sparkCount += 1;
      player.shootDelay = Math.max(0.1, player.shootDelay * 0.98);
    }
  },
  {
    id: 'heavyFlame',
    name: 'Heavy Flame',
    description: 'Increase spark damage and radius.',
    apply: (player) => {
      player.sparkDamage += 3;
      player.sparkRadius += 1.5;
    }
  },
  {
    id: 'lanternRadius',
    name: 'Expanded Lantern',
    description: 'Extend your light radius.',
    apply: (player) => {
      player.lanternRadius += 26;
    }
  },
  {
    id: 'swiftSteps',
    name: 'Swift Steps',
    description: 'Move faster through the dark.',
    apply: (player) => {
      player.speed += 18;
    }
  },
  {
    id: 'fortitude',
    name: 'Fortitude',
    description: 'Gain a health boost.',
    apply: (player) => {
      player.maxHealth += 18;
      player.health += 18;
    }
  },
  {
    id: 'gemDrinker',
    name: 'Gem Drinker',
    description: 'Collecting gems restores a little health.',
    apply: (player) => {
      player.gemHealing += 2;
    }
  },
  {
    id: 'piercingSpark',
    name: 'Piercing Spark',
    description: 'Sparks pass through enemies.',
    apply: (player) => {
      player.piercing += 1;
    }
  },
  {
    id: 'flare',
    name: 'Flare Pulse',
    description: 'Occasional burst light pulses outward.',
    apply: (player) => {
      player.flareRate += 0.15;
    }
  }
];

export function getUpgradeDefinitions(playerUpgrades = []) {
  const owned = new Set(playerUpgrades);
  return UPGRADE_CATALOG.filter((upgrade) => !owned.has(upgrade.id));
}

export function getRandomUpgrades(playerUpgrades = [], count = 3, rng = Math.random) {
  const options = [...getUpgradeDefinitions(playerUpgrades)];
  const result = [];
  while (result.length < Math.min(count, options.length) && options.length > 0) {
    const index = Math.floor(rng() * options.length);
    result.push(options.splice(index, 1)[0]);
  }
  return result;
}

export function applyUpgrade(player, upgradeId) {
  const match = UPGRADE_CATALOG.find((upgrade) => upgrade.id === upgradeId);
  if (!match) return false;
  match.apply(player);
  if (!player.upgrades.includes(upgradeId)) {
    player.upgrades.push(upgradeId);
  }
  return true;
}
