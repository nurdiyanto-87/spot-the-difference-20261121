// Main: boots Two Gardens — fixed 1280 x 800 canvas, scaled to the
// window; a requestAnimationFrame loop ticks the clock and redraws every
// frame. Exposes window.__spotGame for automated play-testing only: the
// current screen, the level's differences with their on-screen positions,
// and a click helper, so a test script can play the real game by clicking
// what a player would click.

import { VIEW, LEFT_PANEL, RIGHT_PANEL } from './config.js';
import { newGame, tick, currentLevel } from './state.js';
import { drawFrame } from './render.js';
import { attachInput } from './input.js';
import { sounds } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = newGame();

function fitCanvas() {
  const scale = Math.min(window.innerWidth / VIEW.w, window.innerHeight / VIEW.h);
  canvas.style.width = `${Math.floor(VIEW.w * scale)}px`;
  canvas.style.height = `${Math.floor(VIEW.h * scale)}px`;
  canvas.width = VIEW.w;
  canvas.height = VIEW.h;
}

fitCanvas();
window.addEventListener('resize', fitCanvas);
attachInput(canvas, state);

// Announce state changes for screen readers.
const statusEl = document.getElementById('status');
let lastAnnouncement = '';
function announce() {
  const level = currentLevel(state);
  const text =
    state.screen === 'title'
      ? 'Two Gardens, spot the difference. Press Enter to play.'
      : state.screen === 'playing'
        ? `${level.name}: ${state.found.size} of ${level.differences.length} differences found, ${Math.ceil(state.timeLeft)} seconds left.`
        : state.screen === 'levelComplete'
          ? `${level.name} clear. Score ${state.score}.`
          : state.screen === 'gameOver'
            ? `Time up. You found ${state.found.size} of ${level.differences.length} differences.`
            : `You found every difference. Final score ${state.score}.`;
  if (text !== lastAnnouncement) {
    lastAnnouncement = text;
    statusEl.textContent = text;
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const result = tick(state, dt);
  if (result === 'timeout' && !state.muted) sounds.timeout();
  drawFrame(ctx, state);
  announce();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Play-test hook: drives the game exactly as a player would — by clicking
// screen positions of the differences the level itself defines.
window.__spotGame = {
  get screen() {
    return state.screen;
  },
  get level() {
    return currentLevel(state).name;
  },
  get found() {
    return state.found.size;
  },
  get total() {
    return currentLevel(state).differences.length;
  },
  get score() {
    return state.score;
  },
  get timeLeft() {
    return Math.ceil(state.timeLeft);
  },
  // On-screen (logical canvas) centre of every difference, in the panel
  // named by `panel` (0 = left, 1 = right), whether found or not.
  diffPositions(panel = 0) {
    const rect = panel === 0 ? LEFT_PANEL : RIGHT_PANEL;
    return currentLevel(state).differences.map((d) => ({
      id: d.id,
      label: d.label,
      x: rect.x + d.x,
      y: rect.y + d.y,
      found: state.found.has(d.id),
    }));
  },
};
