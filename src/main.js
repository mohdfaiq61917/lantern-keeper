import { Game } from './game/Game.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

window.addEventListener('load', () => {
  requestAnimationFrame((time) => game.loop(time));
});
