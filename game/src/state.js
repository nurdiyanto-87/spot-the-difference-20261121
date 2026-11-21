// State: the rules of Two Gardens — screens, timer, scoring, hints,
// and what a click does. Render and input read this; they never mutate
// the rules themselves.

import { LEVELS } from './levels.js';
import { SCORE } from './config.js';

export const SCREENS = ['title', 'playing', 'levelComplete', 'gameOver', 'victory'];

export function newGame() {
  return {
    screen: 'title',
    levelIndex: 0,
    score: 0,
    found: new Set(), // difference ids found in the current level
    hintsLeft: 3,
    timeLeft: LEVELS[0].timeLimit,
    levelBonus: 0,
    // Transient feedback, rendered as it fades (seconds since the event).
    pops: [], // {x, y, panel, age, kind: 'found' | 'wrong'}
    hintSpot: null, // {x, y, age} — the pulsing ring a hint leaves behind
    message: 'Find every difference between the two pictures.',
    messageAge: 0,
    // Keyboard crosshair: which panel it lives in and where.
    cursor: { panel: 0, x: 300, y: 280, visible: false },
    muted: false,
    totalFound: 0,
    startedAt: 0,
  };
}

export function currentLevel(state) {
  return LEVELS[state.levelIndex];
}

export function differencesLeft(state) {
  return currentLevel(state).differences.length - state.found.size;
}

export function levelIsCleared(state) {
  return state.found.size >= currentLevel(state).differences.length;
}

// A click at panel-local (x, y) in either panel. Returns what happened:
// 'found' with the difference, 'wrong', or null when clicks are ignored.
export function clickAt(state, x, y) {
  if (state.screen !== 'playing') return null;
  const level = currentLevel(state);
  for (const diff of level.differences) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      state.found.add(diff.id);
      state.totalFound += 1;
      state.score = Math.max(0, state.score + SCORE.find);
      state.message = `Found it — ${diff.label}!`;
      state.messageAge = 0;
      state.hintSpot = null;
      return { kind: 'found', diff };
    }
  }
  state.score = Math.max(0, state.score + SCORE.wrongClick);
  state.message = 'Not a difference — look closer.';
  state.messageAge = 0;
  return { kind: 'wrong' };
}

// Spend a hint: reveal one difference still unfound, briefly.
export function useHint(state) {
  if (state.screen !== 'playing' || state.hintsLeft <= 0) return null;
  const remaining = currentLevel(state).differences.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return null;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score + SCORE.hint);
  state.hintSpot = { x: pick.x, y: pick.y, r: pick.r, age: 0 };
  state.message = `Hint: something hides near ${pick.label}. (−50)`;
  state.messageAge = 0;
  return pick;
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.found = new Set();
  state.hintsLeft = 3;
  state.timeLeft = LEVELS[index].timeLimit;
  state.levelBonus = 0;
  state.pops = [];
  state.hintSpot = null;
  state.message = LEVELS[index].subtitle;
  state.messageAge = 0;
  state.cursor = { panel: 0, x: 300, y: 280, visible: false };
  state.screen = 'playing';
}

export function finishLevel(state) {
  const bonus = Math.round(state.timeLeft) * SCORE.timeBonusPerSecond + SCORE.levelClearBonus;
  state.levelBonus = bonus;
  state.score += bonus;
  state.screen = 'levelComplete';
}

export function advance(state) {
  if (state.levelIndex + 1 < LEVELS.length) {
    startLevel(state, state.levelIndex + 1);
  } else {
    state.screen = 'victory';
  }
}

// One tick of the clock (dt in seconds). Returns 'timeout' when time runs out.
export function tick(state, dt) {
  state.messageAge += dt;
  for (const pop of state.pops) pop.age += dt;
  state.pops = state.pops.filter((p) => p.age < 0.9);
  if (state.hintSpot) {
    state.hintSpot.age += dt;
    if (state.hintSpot.age > 3) state.hintSpot = null;
  }
  if (state.screen !== 'playing') return null;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = 'gameOver';
    return 'timeout';
  }
  return null;
}
