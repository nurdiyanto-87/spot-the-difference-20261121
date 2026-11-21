// Layout constants and per-level palettes for Two Gardens.
// Every number here is in logical canvas pixels: the game canvas is fixed
// at 1280 x 800 and CSS scales it to the window, so a click in either panel
// always maps back to the same panel-local coordinates.

export const VIEW = { w: 1280, h: 800 };

// Two picture panels, side by side, with a divider strip between them.
export const PANEL = { w: 600, h: 560, y: 76 };
export const LEFT_PANEL = { x: 24, ...PANEL };
export const RIGHT_PANEL = { x: 656, ...PANEL };
export const HUD = { h: 64 };
export const FOOTER = { y: 652, h: 148 };

// Points and penalties: a find is worth far more than a wild guess costs,
// so hunting beats clicking everywhere.
export const SCORE = {
  find: 100,
  wrongClick: -20,
  hint: -50,
  timeBonusPerSecond: 25,
  levelClearBonus: 250,
};

export const PALETTES = {
  morning: {
    name: 'Morning Garden',
    skyTop: '#6fbdf2', skyBottom: '#dff3ff',
    celestial: 'sun', celestialColor: '#ffd94a', celestialGlow: '#fff3b0',
    hillFar: '#8fce7d', hillNear: '#5da84f',
    treeLeaf: '#3e8e41', treeLeafDark: '#2f7031', treeTrunk: '#7a5230',
    houseWall: '#ffe8c2', houseRoof: '#d95f4b', houseDoor: '#8a5a2b',
    pond: '#5fb8e6', pondDeep: '#3d94c9',
    path: '#e8d5a8', flowerStem: '#2f7a33',
    night: false,
  },
  noon: {
    name: 'Pond at Noon',
    skyTop: '#4aa8ee', skyBottom: '#cfeeff',
    celestial: 'sun', celestialColor: '#ffcf2e', celestialGlow: '#fff0a0',
    hillFar: '#79c468', hillNear: '#4f9c44',
    treeLeaf: '#35873a', treeLeafDark: '#27682c', treeTrunk: '#6e4a28',
    houseWall: '#ffdf9e', houseRoof: '#c94f3d', houseDoor: '#7a4a22',
    pond: '#4fb0e0', pondDeep: '#2f88bd',
    path: '#e0c88f', flowerStem: '#2a6e2d',
    night: false,
  },
  twilight: {
    name: 'Twilight Meadow',
    skyTop: '#3b2d6e', skyBottom: '#f08a4b',
    celestial: 'moon', celestialColor: '#f4ead2', celestialGlow: '#fff8e0',
    hillFar: '#5d7a52', hillNear: '#43603c',
    treeLeaf: '#2c5e33', treeLeafDark: '#1f4526', treeTrunk: '#4e3421',
    houseWall: '#e8c99a', houseRoof: '#8a3d33', houseDoor: '#5d3a1a',
    pond: '#3f6f9e', pondDeep: '#2c5378',
    path: '#c9b183', flowerStem: '#245c28',
    night: true,
  },
};
