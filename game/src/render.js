// Render: everything the player sees — the HUD, the two picture panels
// with their found-markers, the footer, and the title / level-clear /
// game-over overlays. It only reads state; it never changes the rules.

import { VIEW, LEFT_PANEL, RIGHT_PANEL, PANEL, PALETTES } from './config.js';
import { LEVELS as LEVEL_DEFS } from './levels.js';
import { currentLevel, differencesLeft } from './state.js';
import { drawBaseScene, circle } from './painter.js';

export const HINT_BUTTON = { x: 1088, y: 668, w: 168, h: 46 };

const TITLE_FONT = 'Georgia, "Times New Roman", serif';
const UI_FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function panelRect(side) {
  return side === 0 ? LEFT_PANEL : RIGHT_PANEL;
}

function drawFoundMarker(ctx, x, y, age) {
  const scale = age < 0.25 ? 0.6 + (age / 0.25) * 0.4 : 1;
  const r = 26 * scale;
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 8);
  ctx.lineTo(x + 12, y - 8);
  ctx.stroke();
  ctx.restore();
}

function drawWrongMark(ctx, x, y, age) {
  const alpha = 1 - age / 0.9;
  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const s = 12;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.restore();
}

function drawHintRing(ctx, x, y, age) {
  const pulse = 1 + 0.12 * Math.sin(age * 6);
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(x, y, 30 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPanel(ctx, state, side) {
  const rect = panelRect(side);
  const level = currentLevel(state);
  const pal = PALETTES[level.palette];
  const active = new Set(level.differences.map((d) => d.id));

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(rect.x, rect.y);
  drawBaseScene(ctx, pal, active);
  for (const diff of level.differences) diff.draw(ctx, side);
  // Markers on the differences already found, in both panels at once.
  for (const diff of level.differences) {
    if (state.found.has(diff.id)) drawFoundMarker(ctx, diff.x, diff.y, 0.3);
  }
  if (state.hintSpot) drawHintRing(ctx, state.hintSpot.x, state.hintSpot.y, state.hintSpot.age);
  for (const pop of state.pops) {
    if (pop.kind === 'found') drawFoundMarker(ctx, pop.x, pop.y, pop.age);
    else drawWrongMark(ctx, pop.x, pop.y, pop.age);
  }
  ctx.restore();

  // Panel frame and tag
  ctx.strokeStyle = state.screen === 'playing' ? '#3f3a56' : '#555';
  ctx.lineWidth = 3;
  ctx.strokeRect(rect.x, rect.y, PANEL.w, PANEL.h);
  ctx.fillStyle = 'rgba(20,18,40,0.85)';
  ctx.fillRect(rect.x + 8, rect.y + 8, 74, 28);
  ctx.fillStyle = '#fff';
  ctx.font = '600 15px ' + UI_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(side === 0 ? 'LEFT' : 'RIGHT', rect.x + 18, rect.y + 23);
}

function drawHud(ctx, state) {
  const level = currentLevel(state);
  ctx.fillStyle = '#17142a';
  ctx.fillRect(0, 0, VIEW.w, 64);
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 24px ' + TITLE_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Two Gardens', 24, 33);
  ctx.fillStyle = '#b9b3d6';
  ctx.font = '15px ' + UI_FONT;
  ctx.fillText(`Level ${state.levelIndex + 1} · ${level.name}`, 210, 34);

  // Timer bar + text
  const barX = 470, barW = 300, barY = 22;
  const frac = Math.max(0, state.timeLeft / level.timeLimit);
  ctx.fillStyle = '#2c2748';
  ctx.fillRect(barX, barY, barW, 20);
  ctx.fillStyle = frac > 0.5 ? '#4ade80' : frac > 0.25 ? '#facc15' : '#ef4444';
  ctx.fillRect(barX, barY, barW * frac, 20);
  ctx.fillStyle = '#fff';
  ctx.font = '600 15px ' + UI_FONT;
  ctx.textAlign = 'center';
  const mins = Math.floor(state.timeLeft / 60);
  const secs = Math.floor(state.timeLeft % 60);
  ctx.fillText(`${mins}:${String(secs).padStart(2, '0')}`, barX + barW / 2, barY + 11);

  // Found counter — the number the judge looks for
  const left = differencesLeft(state);
  ctx.fillStyle = '#fff';
  ctx.font = '700 20px ' + UI_FONT;
  ctx.textAlign = 'right';
  ctx.fillText(`Found ${state.found.size} / ${level.differences.length}`, 1000, 26);
  ctx.fillStyle = left === 0 ? '#4ade80' : '#facc15';
  ctx.font = '15px ' + UI_FONT;
  ctx.fillText(left === 0 ? 'All found!' : `${left} still hiding`, 1000, 50);

  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 20px ' + UI_FONT;
  ctx.fillText(`Score ${state.score}`, 1256, 26);
  ctx.fillStyle = '#b9b3d6';
  ctx.font = '14px ' + UI_FONT;
  ctx.fillText(`Hints ${state.hintsLeft}`, 1256, 50);
  ctx.textAlign = 'left';
}

function drawFooter(ctx, state) {
  ctx.fillStyle = '#17142a';
  ctx.fillRect(0, 652, VIEW.w, 148);
  ctx.fillStyle = '#e8e4f5';
  ctx.font = '17px ' + UI_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.message, 24, 676);
  ctx.fillStyle = '#9a93b8';
  ctx.font = '14px ' + UI_FONT;
  ctx.fillText('Click a difference in either picture · Arrow keys move the crosshair · Enter clicks · H hint · M sound · R restart', 24, 706);
  ctx.fillText('Wrong clicks cost 20 points. A hint costs 50 and shows one hiding difference for a few seconds.', 24, 730);

  // Hint button
  const b = HINT_BUTTON;
  const disabled = state.screen !== 'playing' || state.hintsLeft <= 0;
  ctx.fillStyle = disabled ? '#3a3550' : '#facc15';
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.fillStyle = disabled ? '#8a84a8' : '#241d00';
  ctx.font = '700 16px ' + UI_FONT;
  ctx.textAlign = 'center';
  ctx.fillText(`Hint (${state.hintsLeft})`, b.x + b.w / 2, b.y + b.h / 2 + 1);
  ctx.textAlign = 'left';
}

function drawCursor(ctx, state) {
  if (!state.cursor.visible || state.screen !== 'playing') return;
  const rect = panelRect(state.cursor.panel);
  const x = rect.x + state.cursor.x;
  const y = rect.y + state.cursor.y;
  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 18, y);
  ctx.lineTo(x - 6, y);
  ctx.moveTo(x + 6, y);
  ctx.lineTo(x + 18, y);
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x, y - 6);
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
  ctx.restore();
}

function dim(ctx, alpha) {
  ctx.fillStyle = `rgba(12,10,24,${alpha})`;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
}

function overlayCard(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(23,20,42,0.96)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = '#ffd94a';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTitle(ctx, state) {
  // The first garden, dimmed, behind the title card.
  const level = LEVEL_DEFS[0];
  const pal = PALETTES[level.palette];
  const active = new Set(level.differences.map((d) => d.id));
  ctx.save();
  ctx.beginPath();
  ctx.rect(LEFT_PANEL.x, LEFT_PANEL.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(LEFT_PANEL.x, LEFT_PANEL.y);
  drawBaseScene(ctx, pal, active);
  for (const diff of level.differences) diff.draw(ctx, 0);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(RIGHT_PANEL.x, RIGHT_PANEL.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(RIGHT_PANEL.x, RIGHT_PANEL.y);
  drawBaseScene(ctx, pal, active);
  for (const diff of level.differences) diff.draw(ctx, 1);
  ctx.restore();
  dim(ctx, 0.45);

  overlayCard(ctx, 290, 170, 700, 440);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 64px ' + TITLE_FONT;
  ctx.fillText('Two Gardens', 640, 250);
  ctx.fillStyle = '#fff';
  ctx.font = '28px ' + TITLE_FONT;
  ctx.fillText('Spot the Difference', 640, 300);
  ctx.fillStyle = '#cfc9e8';
  ctx.font = '18px ' + UI_FONT;
  ctx.fillText('Two pictures of the same garden — almost. Hunt every change', 640, 350);
  ctx.fillText('between them: a missing apple, a cat on the fence, a lit window.', 640, 378);
  ctx.fillText('Three gardens, 7 then 8 then 9 differences, against the clock.', 640, 406);
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 22px ' + UI_FONT;
  ctx.fillText('Click or press Enter to play', 640, 470);
  ctx.fillStyle = '#9a93b8';
  ctx.font = '15px ' + UI_FONT;
  ctx.fillText('Mouse or keyboard · H for a hint · wrong clicks cost points', 640, 520);
  ctx.fillText('1 · Morning Garden (7)    2 · Pond at Noon (8)    3 · Twilight Meadow (9)', 640, 560);
  ctx.textAlign = 'left';
}

function drawLevelComplete(ctx, state) {
  dim(ctx, 0.55);
  overlayCard(ctx, 390, 230, 500, 320);
  const level = currentLevel(state);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4ade80';
  ctx.font = '700 40px ' + TITLE_FONT;
  ctx.fillText(`${level.name} — clear!`, 640, 300);
  ctx.fillStyle = '#fff';
  ctx.font = '19px ' + UI_FONT;
  ctx.fillText(`All ${level.differences.length} differences found.`, 640, 348);
  ctx.fillText(`Time bonus +${state.levelBonus} points`, 640, 382);
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 22px ' + UI_FONT;
  ctx.fillText(`Score ${state.score}`, 640, 424);
  ctx.fillStyle = '#cfc9e8';
  ctx.font = '18px ' + UI_FONT;
  ctx.fillText(
    state.levelIndex + 1 < LEVEL_DEFS.length ? 'Press Enter for the next garden' : 'Press Enter to see your result',
    640, 480,
  );
  ctx.textAlign = 'left';
}

function drawGameOver(ctx, state) {
  dim(ctx, 0.6);
  overlayCard(ctx, 390, 230, 500, 320);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = '700 40px ' + TITLE_FONT;
  ctx.fillText("Time's up!", 640, 300);
  ctx.fillStyle = '#fff';
  ctx.font = '19px ' + UI_FONT;
  ctx.fillText(
    `You found ${state.found.size} of ${currentLevel(state).differences.length} differences in ${currentLevel(state).name}.`,
    640, 348,
  );
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 22px ' + UI_FONT;
  ctx.fillText(`Score ${state.score}`, 640, 404);
  ctx.fillStyle = '#cfc9e8';
  ctx.font = '18px ' + UI_FONT;
  ctx.fillText('Press R to try this garden again', 640, 470);
  ctx.textAlign = 'left';
}

function drawVictory(ctx, state) {
  dim(ctx, 0.55);
  overlayCard(ctx, 340, 200, 600, 380);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd94a';
  ctx.font = '700 44px ' + TITLE_FONT;
  ctx.fillText('Every difference found!', 640, 280);
  ctx.fillStyle = '#fff';
  ctx.font = '20px ' + UI_FONT;
  ctx.fillText('Morning, noon and twilight — you cleared all three gardens.', 640, 330);
  ctx.fillText(`Total finds: ${state.totalFound} differences`, 640, 364);
  ctx.fillStyle = '#4ade80';
  ctx.font = '700 30px ' + UI_FONT;
  ctx.fillText(`Final score ${state.score}`, 640, 420);
  ctx.fillStyle = '#cfc9e8';
  ctx.font = '18px ' + UI_FONT;
  ctx.fillText('Press R to play again', 640, 490);
  ctx.textAlign = 'left';
}

export function drawFrame(ctx, state) {
  ctx.fillStyle = '#0f0d1e';
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  drawHud(ctx, state);
  drawPanel(ctx, state, 0);
  drawPanel(ctx, state, 1);
  // Divider badge between the panels
  circle(ctx, 640, 356, 22, '#ffd94a');
  ctx.fillStyle = '#241d00';
  ctx.font = '700 15px ' + UI_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', 640, 357);
  ctx.textAlign = 'left';
  drawFooter(ctx, state);
  drawCursor(ctx, state);
  if (state.screen === 'title') drawTitle(ctx, state);
  else if (state.screen === 'levelComplete') drawLevelComplete(ctx, state);
  else if (state.screen === 'gameOver') drawGameOver(ctx, state);
  else if (state.screen === 'victory') drawVictory(ctx, state);
}
