// Painter: every picture in Two Gardens is drawn procedurally on canvas —
// no image assets, no fonts, no network. The base scene is identical in
// both panels; each difference (levels.js) then draws its own element per
// side, so the two pictures diverge only where a difference says so.
//
// Panel-local coordinates: every panel is 600 x 560. drawBaseScene skips
// any element that is a difference in the active level (the difference
// function draws it instead); elements that differ in another level only
// are drawn normally here.

export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  ctx.stroke();
}

export function drawButterfly(ctx, x, y, s, wing) {
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.ellipse(x - 7 * s, y - 4 * s, 8 * s, 6 * s, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 7 * s, y - 4 * s, 8 * s, 6 * s, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 6 * s, y + 5 * s, 6 * s, 4 * s, 0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 6 * s, y + 5 * s, 6 * s, 4 * s, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.ellipse(x, y, 2.5 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawTulip(ctx, x, y, s, petal, stem) {
  ctx.strokeStyle = stem;
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 26 * s);
  ctx.lineTo(x, y + 6 * s);
  ctx.stroke();
  ctx.fillStyle = stem;
  ctx.beginPath();
  ctx.ellipse(x - 6 * s, y + 16 * s, 7 * s, 3 * s, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = petal;
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y + 6 * s);
  ctx.quadraticCurveTo(x - 11 * s, y - 12 * s, x - 4 * s, y - 8 * s);
  ctx.quadraticCurveTo(x, y - 16 * s, x + 4 * s, y - 8 * s);
  ctx.quadraticCurveTo(x + 11 * s, y - 12 * s, x + 9 * s, y + 6 * s);
  ctx.quadraticCurveTo(x, y + 12 * s, x - 9 * s, y + 6 * s);
  ctx.fill();
}

export function drawDaisy(ctx, x, y, petals, center) {
  const s = 1;
  ctx.strokeStyle = '#2f7a33';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 24 * s);
  ctx.lineTo(x, y + 4 * s);
  ctx.stroke();
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    ctx.fillStyle = '#fff8e7';
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 9 * s, y + Math.sin(a) * 9 * s, 6 * s, 4 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, x, y, 5 * s, center);
}

export function drawMushroom(ctx, x, y, s) {
  ctx.fillStyle = '#f3ead8';
  ctx.fillRect(x - 3 * s, y, 6 * s, 10 * s);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(x, y, 12 * s, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#fff';
  circle(ctx, x - 5 * s, y - 5 * s, 2 * s, '#fff');
  circle(ctx, x + 4 * s, y - 8 * s, 2.5 * s, '#fff');
  circle(ctx, x + 6 * s, y - 3 * s, 1.8 * s, '#fff');
}

export function drawCat(ctx, x, y, s) {
  // A small grey cat sitting on the fence, tail curled, facing left.
  ctx.fillStyle = '#8d8d9e';
  ctx.beginPath();
  ctx.ellipse(x, y, 13 * s, 10 * s, 0, 0, Math.PI * 2); // body
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 10 * s, y - 11 * s, 7 * s, 0, Math.PI * 2); // head
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 16 * s, y - 16 * s);
  ctx.lineTo(x - 13 * s, y - 22 * s);
  ctx.lineTo(x - 10 * s, y - 16 * s);
  ctx.moveTo(x - 7 * s, y - 17 * s);
  ctx.lineTo(x - 4 * s, y - 23 * s);
  ctx.lineTo(x - 2 * s, y - 16 * s);
  ctx.fill();
  ctx.strokeStyle = '#8d8d9e';
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y + 4 * s);
  ctx.quadraticCurveTo(x + 22 * s, y + 2 * s, x + 20 * s, y - 8 * s);
  ctx.stroke();
  ctx.fillStyle = '#2b2b33';
  circle(ctx, x - 12 * s, y - 12 * s, 1.2 * s, '#2b2b33');
}

export function drawDuck(ctx, x, y, s) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x, y, 14 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 11 * s, y - 8 * s, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2a541';
  ctx.beginPath();
  ctx.moveTo(x - 17 * s, y - 8 * s);
  ctx.lineTo(x - 23 * s, y - 6 * s);
  ctx.lineTo(x - 17 * s, y - 5 * s);
  ctx.fill();
  ctx.fillStyle = '#2b2b33';
  circle(ctx, x - 13 * s, y - 9 * s, 1.2 * s, '#2b2b33');
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(x, y + 10 * s, 16 * s, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

export function drawFish(ctx, x, y, s) {
  ctx.fillStyle = '#ff8c42';
  ctx.beginPath();
  ctx.ellipse(x, y, 10 * s, 6 * s, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 9 * s, y - 2 * s);
  ctx.lineTo(x + 16 * s, y - 7 * s);
  ctx.lineTo(x + 16 * s, y + 3 * s);
  ctx.fill();
  ctx.fillStyle = '#2b2b33';
  circle(ctx, x - 5 * s, y - 2 * s, 1.2 * s, '#2b2b33');
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(x, y + 12 * s, 8 * s, Math.PI, 0);
  ctx.stroke();
}

export function drawFrog(ctx, x, y, s) {
  ctx.fillStyle = '#58a34c';
  ctx.beginPath();
  ctx.ellipse(x, y, 11 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x - 6 * s, y - 7 * s, 4 * s, '#58a34c');
  circle(ctx, x + 6 * s, y - 7 * s, 4 * s, '#58a34c');
  ctx.fillStyle = '#1d1d22';
  circle(ctx, x - 6 * s, y - 8 * s, 1.6 * s, '#1d1d22');
  circle(ctx, x + 6 * s, y - 8 * s, 1.6 * s, '#1d1d22');
}

export function drawKite(ctx, x, y, s) {
  ctx.strokeStyle = 'rgba(60,40,20,0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y + 18 * s);
  ctx.quadraticCurveTo(x + 40 * s, y + 90 * s, x + 30 * s, y + 150 * s);
  ctx.stroke();
  ctx.fillStyle = '#e84a5f';
  ctx.beginPath();
  ctx.moveTo(x, y - 18 * s);
  ctx.lineTo(x + 16 * s, y);
  ctx.lineTo(x, y + 18 * s);
  ctx.lineTo(x - 16 * s, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd94a';
  ctx.beginPath();
  ctx.moveTo(x, y - 18 * s);
  ctx.lineTo(x + 16 * s, y);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e84a5f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y + 30 * s);
  ctx.lineTo(x + 10 * s, y + 42 * s);
  ctx.moveTo(x + 12 * s, y + 55 * s);
  ctx.lineTo(x + 16 * s, y + 66 * s);
  ctx.stroke();
}

export function drawOwl(ctx, x, y, s) {
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.ellipse(x, y, 11 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 8 * s, y - 12 * s, 7 * s, 0, Math.PI * 2);
  ctx.arc(x + 8 * s, y - 12 * s, 7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  circle(ctx, x - 8 * s, y - 12 * s, 5 * s, '#fff');
  circle(ctx, x + 8 * s, y - 12 * s, 5 * s, '#fff');
  ctx.fillStyle = '#1d1d22';
  circle(ctx, x - 8 * s, y - 12 * s, 2.2 * s, '#1d1d22');
  circle(ctx, x + 8 * s, y - 12 * s, 2.2 * s, '#1d1d22');
  ctx.fillStyle = '#f2a541';
  ctx.beginPath();
  ctx.moveTo(x - 3 * s, y - 8 * s);
  ctx.lineTo(x + 3 * s, y - 8 * s);
  ctx.lineTo(x, y - 3 * s);
  ctx.closePath();
  ctx.fill();
}

export function drawBucket(ctx, x, y, s, tipped) {
  ctx.save();
  ctx.translate(x, y);
  if (tipped) ctx.rotate(Math.PI / 2.2);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(-9 * s, -8 * s);
  ctx.lineTo(9 * s, -8 * s);
  ctx.lineTo(7 * s, 8 * s);
  ctx.lineTo(-7 * s, 8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(-9 * s, -10 * s, 18 * s, 3 * s);
  ctx.restore();
  if (tipped) {
    ctx.fillStyle = 'rgba(120,190,230,0.8)';
    ctx.beginPath();
    ctx.ellipse(x + 14 * s, y + 8 * s, 10 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// The base scene: sky, celestial body, hills, tree, house, pond, fence,
// path and flowers. `active` is the set of difference ids of this level;
// any element that is a difference here is left for the difference
// function to draw, so the two panels only ever differ where told to.
export function drawBaseScene(ctx, pal, active) {
  const W = 600, H = 560;

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, pal.skyTop);
  sky.addColorStop(1, pal.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 380);

  // Stars (twilight only; the one gold star is a difference)
  if (pal.night) {
    ctx.fillStyle = '#fff';
    for (const [sx, sy, sr] of [[60, 40, 1.6], [150, 90, 1.3], [230, 35, 1.8], [380, 45, 1.4], [470, 130, 1.5], [540, 50, 1.7], [520, 170, 1.2], [90, 140, 1.2]]) {
      circle(ctx, sx, sy, sr, '#ffffff');
    }
  }

  // Celestial body (sun by day, moon at twilight); rays are a difference.
  circle(ctx, 85, 75, 30, pal.celestialGlow);
  circle(ctx, 85, 75, 26, pal.celestialColor);
  if (pal.celestial === 'moon') {
    circle(ctx, 76, 68, 6, '#d9cba8');
    circle(ctx, 94, 82, 4, '#d9cba8');
  }

  // Clouds
  const cloudColor = pal.night ? '#8d7fb8' : '#ffffff';
  cloud(ctx, 185, 70, 1, cloudColor);
  cloud(ctx, 350, 52, 0.85, cloudColor);

  // Hills and ground
  ellipse(ctx, 150, 580, 430, 200, pal.hillFar);
  ellipse(ctx, 480, 600, 400, 190, pal.hillNear);
  rect(ctx, 0, 380, W, 180, pal.hillNear);
  // A soft darker strip where the ground meets the sky
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 380, W, 8);

  // Tree (left), with a branch the owl can perch on
  ctx.fillStyle = pal.treeTrunk;
  ctx.fillRect(98, 210, 24, 190);
  ctx.beginPath();
  ctx.moveTo(110, 260);
  ctx.lineTo(170, 235);
  ctx.lineTo(172, 244);
  ctx.lineTo(112, 272);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 110, 175, 68, pal.treeLeaf);
  circle(ctx, 58, 215, 44, pal.treeLeafDark);
  circle(ctx, 162, 212, 46, pal.treeLeaf);
  circle(ctx, 110, 130, 40, pal.treeLeafDark);
  // Apples: three always here, one is a difference in the noon level
  for (const [ax, ay] of [[80, 190], [140, 165], [165, 205]]) {
    circle(ctx, ax, ay, 6, '#e84a3f');
  }
  if (!active.has('apple')) circle(ctx, 105, 148, 6, '#e84a3f');

  // House (right of centre)
  rect(ctx, 385, 300, 160, 120, pal.houseWall);
  ctx.fillStyle = pal.houseRoof;
  ctx.beginPath();
  ctx.moveTo(370, 302);
  ctx.lineTo(560, 302);
  ctx.lineTo(465, 232);
  ctx.closePath();
  ctx.fill();
  // Chimney and smoke (the third puff is a difference at twilight)
  rect(ctx, 518, 238, 24, 58, '#a89a8a');
  ctx.fillStyle = pal.night ? '#b9aed6' : '#e8e8e8';
  circle(ctx, 540, 222, 9, ctx.fillStyle);
  circle(ctx, 548, 202, 12, ctx.fillStyle);
  // Door
  rect(ctx, 448, 350, 38, 70, pal.houseDoor);
  circle(ctx, 478, 388, 3, '#ffd94a');
  // Window frame; its glass is drawn by the base only when no difference owns it
  rect(ctx, 398, 322, 40, 40, '#6b4a2f');
  if (!active.has('window-light') && !active.has('curtain')) {
    rect(ctx, 402, 326, 32, 32, pal.night ? '#3a3a55' : '#ffe9a8');
  }
  rect(ctx, 500, 322, 40, 40, '#6b4a2f');
  rect(ctx, 504, 326, 32, 32, pal.night ? '#3a3a55' : '#bfe6ff');
  // Window crossbars
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(416, 326, 4, 32);
  ctx.fillRect(402, 340, 32, 4);
  ctx.fillRect(518, 326, 4, 32);
  ctx.fillRect(504, 340, 32, 4);

  // Fence across the middle ground; one post is a difference at noon
  ctx.fillStyle = '#a9805a';
  ctx.fillRect(20, 330, 340, 7);
  ctx.fillRect(20, 352, 340, 7);
  for (let px = 30; px <= 350; px += 40) {
    if (px === 190 && active.has('fence-post')) continue;
    ctx.fillRect(px, 318, 10, 48);
  }

  // Path of flat stones from the door to the bottom edge
  ctx.fillStyle = pal.path;
  for (const [sx, sy] of [[440, 435], [395, 495], [370, 525], [350, 552]]) {
    ellipse(ctx, sx, sy, 16, 8, pal.path);
  }
  if (!active.has('path-stone')) ellipse(ctx, 415, 465, 16, 8, pal.path);

  // Pond (bottom right)
  ellipse(ctx, 470, 492, 112, 56, pal.pondDeep);
  ellipse(ctx, 470, 488, 104, 50, pal.pond);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(440, 478, 34, 8, -0.2, 0, Math.PI * 2);
  ctx.stroke();
  // Lily pads: three always here, one more is a difference at noon
  ctx.fillStyle = '#3f9e4d';
  ellipse(ctx, 420, 482, 18, 8, '#3f9e4d');
  ellipse(ctx, 480, 508, 20, 9, '#3f9e4d');
  ellipse(ctx, 522, 476, 16, 7, '#3f9e4d');
  circle(ctx, 516, 470, 4, '#ff9ecf');
  circle(ctx, 524, 472, 3, '#ff9ecf');

  // Birds already in the sky (a third is a difference in the morning)
  const birdColor = pal.night ? '#2b2440' : '#3a3a44';
  drawBird(ctx, 300, 90, 1, birdColor);
  drawBird(ctx, 385, 122, 0.85, birdColor);

  // Flower meadow, bottom left. One tulip's colour and one daisy's
  // petals are differences; otherwise they grow here.
  if (!active.has('flower-color')) drawTulip(ctx, 160, 480, 1, '#e84a5f', pal.flowerStem);
  drawTulip(ctx, 60, 470, 1, '#e84a5f', pal.flowerStem);
  drawTulip(ctx, 110, 500, 1, '#f2a541', pal.flowerStem);
  drawTulip(ctx, 210, 510, 1, '#f2a541', pal.flowerStem);
  drawTulip(ctx, 250, 492, 1, '#e84a5f', pal.flowerStem);
  if (!active.has('petal')) drawDaisy(ctx, 300, 500, 6, '#ffd94a');
  drawDaisy(ctx, 90, 530, 6, '#ffd94a');
  drawDaisy(ctx, 200, 535, 6, '#ffd94a');
}
