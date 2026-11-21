// Input: mouse and keyboard, both first-class. A click inside either
// picture tests the difference under it; the keyboard drives a crosshair
// (arrows move, Enter clicks, Tab switches picture), H spends a hint,
// M toggles sound, R restarts, Enter advances between screens.

import { LEFT_PANEL, RIGHT_PANEL, PANEL, VIEW } from './config.js';
import { clickAt, useHint, startLevel, advance, finishLevel, levelIsCleared } from './state.js';
import { HINT_BUTTON } from './render.js';
import { sounds } from './audio.js';

// Convert a pointer event on the canvas to logical 1280 x 800 coordinates.
function toLogical(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEW.w,
    y: ((event.clientY - rect.top) / rect.height) * VIEW.h,
  };
}

function panelAt(x, y) {
  for (const [side, p] of [[0, LEFT_PANEL], [1, RIGHT_PANEL]]) {
    if (x >= p.x && x < p.x + PANEL.w && y >= p.y && y < p.y + PANEL.h) {
      return { side, lx: x - p.x, ly: y - p.y };
    }
  }
  return null;
}

function inside(r, x, y) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

function actOnClick(state, x, y) {
  const hit = panelAt(x, y);
  if (!hit) return;
  const result = clickAt(state, hit.lx, hit.ly);
  if (!result) return;
  if (result.kind === 'found') {
    state.pops.push({ x: hit.lx, y: hit.ly, age: 0, kind: 'found' });
    if (!state.muted) sounds.found();
    if (levelIsCleared(state)) {
      // Let the last marker's pop show for a beat, then clear the level.
      setTimeout(() => {
        if (state.screen === 'playing' && levelIsCleared(state)) {
          finishLevel(state);
          if (!state.muted) sounds.clear();
        }
      }, 650);
    }
  } else {
    state.pops.push({ x: hit.lx, y: hit.ly, age: 0, kind: 'wrong' });
    if (!state.muted) sounds.wrong();
  }
}

export function attachInput(canvas, state) {
  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = toLogical(canvas, event);
    if (state.screen === 'title') {
      if (!state.muted) sounds.click();
      startLevel(state, 0);
      return;
    }
    if (state.screen === 'levelComplete' || state.screen === 'victory') {
      if (!state.muted) sounds.click();
      advance(state);
      return;
    }
    if (state.screen === 'gameOver') return; // R restarts from here
    if (inside(HINT_BUTTON, x, y)) {
      const pick = useHint(state);
      if (pick && !state.muted) sounds.hint();
      return;
    }
    state.cursor.visible = false;
    actOnClick(state, x, y);
  });

  canvas.addEventListener('pointermove', (event) => {
    const { x, y } = toLogical(canvas, event);
    const hit = panelAt(x, y);
    if (hit) {
      state.cursor.panel = hit.side;
      state.cursor.x = hit.lx;
      state.cursor.y = hit.ly;
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'm' || key === 'M') {
      state.muted = !state.muted;
      state.message = state.muted ? 'Sound off.' : 'Sound on.';
      state.messageAge = 0;
      return;
    }
    if (key === 'r' || key === 'R') {
      if (state.screen !== 'title') {
        startLevel(state, state.screen === 'gameOver' ? state.levelIndex : 0);
        if (!state.muted) sounds.click();
      }
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (state.screen === 'title') {
        startLevel(state, 0);
      } else if (state.screen === 'levelComplete' || state.screen === 'victory') {
        advance(state);
      } else if (state.screen === 'playing') {
        state.cursor.visible = true;
        actOnClick(state, panelAtX(state), panelAtY(state));
      }
      return;
    }
    if (state.screen !== 'playing') return;
    if (key === 'h' || key === 'H') {
      const pick = useHint(state);
      if (pick && !state.muted) sounds.hint();
      return;
    }
    if (key === 'Tab') {
      event.preventDefault();
      state.cursor.panel = 1 - state.cursor.panel;
      state.cursor.visible = true;
      return;
    }
    const step = event.shiftKey ? 4 : 14;
    const c = state.cursor;
    if (key === 'ArrowLeft') { c.x = Math.max(0, c.x - step); c.visible = true; }
    else if (key === 'ArrowRight') { c.x = Math.min(PANEL.w, c.x + step); c.visible = true; }
    else if (key === 'ArrowUp') { c.y = Math.max(0, c.y - step); c.visible = true; }
    else if (key === 'ArrowDown') { c.y = Math.min(PANEL.h, c.y + step); c.visible = true; }
    else return;
    event.preventDefault();
  });
}

function panelAtX(state) {
  return (state.cursor.panel === 0 ? LEFT_PANEL.x : RIGHT_PANEL.x) + state.cursor.x;
}

function panelAtY(state) {
  return PANEL.y + state.cursor.y;
}
