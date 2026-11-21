// Levels: three gardens, one scene each, with rising difficulty.
// A difference is { id, label, x, y, r, draw(ctx, side) }: panel-local
// coordinates (the panel is 600 x 560) and a function that paints the
// differing element for the left panel (side 0) or the right (side 1).
// A fair difference is drawn, never erased: the base scene leaves any
// element that differs in this level to its difference function, so the
// two pictures diverge exactly where the differences say.

import {
  circle, ellipse, rect,
  drawBird, drawButterfly, drawTulip, drawDaisy, drawMushroom, drawCat,
  drawDuck, drawFish, drawFrog, drawKite, drawOwl, drawBucket,
} from './painter.js';

function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function sunRays(ctx, cx, cy) {
  ctx.strokeStyle = '#ffcf2e';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 36, cy + Math.sin(a) * 36);
    ctx.lineTo(cx + Math.cos(a) * 48, cy + Math.sin(a) * 48);
    ctx.stroke();
  }
}

function extraCloud(ctx, x, y) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.arc(x + 18, y - 7, 13, 0, Math.PI * 2);
  ctx.arc(x + 36, y, 15, 0, Math.PI * 2);
  ctx.arc(x + 18, y + 5, 14, 0, Math.PI * 2);
  ctx.fill();
}

function firefly(ctx, x, y) {
  const glow = ctx.createRadialGradient(x, y, 1, x, y, 18);
  glow.addColorStop(0, 'rgba(190,255,120,0.9)');
  glow.addColorStop(1, 'rgba(190,255,120,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x, y, 3, '#d8ff8a');
}

function lantern(ctx, x, y, lit) {
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x, y - 8);
  ctx.stroke();
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 1, x, y, 22);
    glow.addColorStop(0, 'rgba(255,210,90,0.85)');
    glow.addColorStop(1, 'rgba(255,210,90,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    rect(ctx, x - 7, y - 8, 14, 16, '#ffd95e');
  } else {
    rect(ctx, x - 7, y - 8, 14, 16, '#4a4038');
  }
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 8, y - 10, 16, 3);
  ctx.fillRect(x - 8, y + 8, 16, 3);
}

function windowGlass(ctx, lit) {
  rect(ctx, 402, 326, 32, 32, lit ? '#ffe9a8' : '#3a3a55');
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(416, 326, 4, 32);
  ctx.fillRect(402, 340, 32, 4);
}

export const LEVELS = [
  {
    id: 'morning',
    name: 'Morning Garden',
    subtitle: 'Seven small changes hide in the morning light.',
    timeLimit: 180,
    palette: 'morning',
    differences: [
      {
        id: 'sun-rays', label: 'the sun grew rays', x: 85, y: 75, r: 52,
        draw(ctx, side) { if (side === 0) sunRays(ctx, 85, 75); },
      },
      {
        id: 'bird', label: 'a third bird in the sky', x: 452, y: 85, r: 28,
        draw(ctx, side) { if (side === 0) drawBird(ctx, 452, 85, 1, '#3a3a44'); },
      },
      {
        id: 'flower-color', label: 'one tulip changed colour', x: 160, y: 478, r: 26,
        draw(ctx, side) {
          drawTulip(ctx, 160, 480, 1, side === 0 ? '#e84a5f' : '#9b59d0', '#2f7a33');
        },
      },
      {
        id: 'cat', label: 'a cat on the fence', x: 300, y: 312, r: 34,
        draw(ctx, side) { if (side === 0) drawCat(ctx, 300, 318, 1); },
      },
      {
        id: 'window-light', label: 'the window light', x: 418, y: 342, r: 30,
        draw(ctx, side) { windowGlass(ctx, side === 0); },
      },
      {
        id: 'mushroom', label: 'a mushroom by the tree', x: 150, y: 418, r: 24,
        draw(ctx, side) { if (side === 0) drawMushroom(ctx, 150, 420, 1); },
      },
      {
        id: 'butterfly', label: 'a butterfly over the flowers', x: 270, y: 448, r: 26,
        draw(ctx, side) { if (side === 0) drawButterfly(ctx, 270, 450, 1, '#ff8fd0'); },
      },
    ],
  },
  {
    id: 'noon',
    name: 'Pond at Noon',
    subtitle: 'Eight changes now — smaller, and closer together.',
    timeLimit: 150,
    palette: 'noon',
    differences: [
      {
        id: 'duck', label: 'a duck on the pond', x: 500, y: 490, r: 30,
        draw(ctx, side) { if (side === 0) drawDuck(ctx, 500, 490, 1); },
      },
      {
        id: 'lily-pad', label: 'an extra lily pad', x: 455, y: 520, r: 24,
        draw(ctx, side) { if (side === 1) ellipse(ctx, 455, 520, 18, 8, '#3f9e4d'); },
      },
      {
        id: 'fish', label: 'a fish jumping', x: 440, y: 458, r: 26,
        draw(ctx, side) { if (side === 1) drawFish(ctx, 440, 458, 1); },
      },
      {
        id: 'cloud', label: 'an extra cloud', x: 482, y: 100, r: 40,
        draw(ctx, side) { if (side === 1) extraCloud(ctx, 482, 100); },
      },
      {
        id: 'apple', label: 'an apple on the tree', x: 105, y: 148, r: 20,
        draw(ctx, side) { if (side === 0) circle(ctx, 105, 148, 6, '#e84a3f'); },
      },
      {
        id: 'fence-post', label: 'a fence post', x: 195, y: 342, r: 22,
        draw(ctx, side) { if (side === 0) rect(ctx, 190, 318, 10, 48, '#a9805a'); },
      },
      {
        id: 'bucket', label: 'the bucket tipped over', x: 362, y: 500, r: 28,
        draw(ctx, side) { drawBucket(ctx, 362, 500, 1, side === 1); },
      },
      {
        id: 'kite', label: 'a kite in the sky', x: 522, y: 112, r: 38,
        draw(ctx, side) { if (side === 1) drawKite(ctx, 522, 112, 1); },
      },
    ],
  },
  {
    id: 'twilight',
    name: 'Twilight Meadow',
    subtitle: 'Nine changes in the dusk — the hardest hunt of all.',
    timeLimit: 120,
    palette: 'twilight',
    differences: [
      {
        id: 'firefly', label: 'a firefly over the grass', x: 200, y: 380, r: 22,
        draw(ctx, side) { if (side === 1) firefly(ctx, 200, 380); },
      },
      {
        id: 'star', label: 'one star shining gold', x: 300, y: 60, r: 20,
        draw(ctx, side) {
          if (side === 0) star4(ctx, 300, 60, 9, '#ffd94a');
          else star4(ctx, 300, 60, 4, '#cfc4ee');
        },
      },
      {
        id: 'lantern', label: 'the porch lantern', x: 498, y: 360, r: 26,
        draw(ctx, side) { lantern(ctx, 498, 360, side === 0); },
      },
      {
        id: 'owl', label: 'an owl on the branch', x: 171, y: 224, r: 30,
        draw(ctx, side) { if (side === 1) drawOwl(ctx, 171, 224, 1); },
      },
      {
        id: 'petal', label: 'a petal missing from the daisy', x: 300, y: 498, r: 28,
        draw(ctx, side) { drawDaisy(ctx, 300, 500, side === 0 ? 6 : 5, '#ffd94a'); },
      },
      {
        id: 'frog', label: 'a frog on the lily pad', x: 420, y: 480, r: 24,
        draw(ctx, side) { if (side === 0) drawFrog(ctx, 420, 480, 1); },
      },
      {
        id: 'curtain', label: 'the window curtain', x: 418, y: 342, r: 30,
        draw(ctx, side) {
          if (side === 0) {
            windowGlass(ctx, false);
            rect(ctx, 402, 326, 6, 32, '#c94f6d'); // open curtains, drawn aside
            rect(ctx, 428, 326, 6, 32, '#c94f6d');
          } else {
            rect(ctx, 402, 326, 32, 32, '#c94f6d'); // curtain drawn shut
            ctx.strokeStyle = 'rgba(0,0,0,0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(412, 326); ctx.lineTo(412, 358);
            ctx.moveTo(422, 326); ctx.lineTo(422, 358);
            ctx.stroke();
          }
        },
      },
      {
        id: 'path-stone', label: 'a stone on the path', x: 415, y: 465, r: 22,
        draw(ctx, side) { if (side === 0) ellipse(ctx, 415, 465, 16, 8, '#c9b183'); },
      },
      {
        id: 'smoke', label: 'a third puff of chimney smoke', x: 556, y: 182, r: 24,
        draw(ctx, side) { if (side === 0) circle(ctx, 556, 182, 13, '#b9aed6'); },
      },
    ],
  },
];
