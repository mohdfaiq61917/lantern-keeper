import { safeStorageGet, safeStorageSet } from './Progress.js';

export const ACHIEVEMENTS = {
  firstBlood: { title: 'First Blood', description: 'Score 100 points in Survival.' },
  lanternStalwart: { title: 'Lantern Stalwart', description: 'Reach level 5.' },
  bossBreaker: { title: 'Boss Breaker', description: 'Defeat any boss in Boss Rush.' },
  zenKeeper: { title: 'Zen Keeper', description: 'Complete a Zen Mode run.' }
};

export function getAchievementsState() {
  return safeStorageGet('lantern-keeper-achievements', {});
}

export function unlockAchievement(game, achievementId) {
  if (!ACHIEVEMENTS[achievementId]) return false;
  if (game.achievements[achievementId]) return false;
  game.achievements[achievementId] = true;
  safeStorageSet('lantern-keeper-achievements', game.achievements);
  return true;
}

export function maybeGrantAchievements(game) {
  if (game.score >= 100 && !game.achievements.firstBlood) {
    unlockAchievement(game, 'firstBlood');
  }
  if (game.level >= 5 && !game.achievements.lanternStalwart) {
    unlockAchievement(game, 'lanternStalwart');
  }
  if (game.mode === 'boss' && game.bossDefeated && !game.achievements.bossBreaker) {
    unlockAchievement(game, 'bossBreaker');
  }
  if (game.mode === 'zen' && game.zenCleared && !game.achievements.zenKeeper) {
    unlockAchievement(game, 'zenKeeper');
  }
}
