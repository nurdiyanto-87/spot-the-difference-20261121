# Two Gardens — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451/)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nurdiyanto-87/spot-the-difference-20261121/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451/)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nurdiyanto-87/spot-the-difference-20261121/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451/)

Two pictures of the same garden — almost. Hunt every change between them:
a missing apple, a cat on the fence, a lit window, a frog on the lily pad.

**Play it:** serve `game/` with any static server (`node serve.ts`, then
open http://localhost:8080) — it runs in desktop Chrome with no network
requests. Click a difference in either picture, or drive the crosshair
with the arrow keys and press Enter. `H` spends a hint, `M` toggles
sound, `R` restarts.

**Three gardens, rising difficulty:**

1. **Morning Garden** — 7 differences, 3:00 on the clock
2. **Pond at Noon** — 8 differences, 2:30
3. **Twilight Meadow** — 9 differences, 2:00

Every scene is drawn procedurally on canvas — original art, no assets.
Wrong clicks cost 20 points, a hint costs 50, and the time left when a
garden clears turns into bonus points.

**Layout:** `main.ts` hands the entry in (copies `game/` and
`screenshots/` to `/output`, writes `dossier.json` with the vendored
make.fun library). The game's own source is split by job:
`src/config.js` (layout, palettes), `src/painter.js` (procedural scene
art), `src/levels.js` (the three gardens and their differences),
`src/state.js` (rules, timer, scoring), `src/render.js` (HUD, panels,
markers), `src/input.js` (mouse + keyboard), `src/audio.js`
(synthesized sounds), `src/main.js` (bootstrap + loop).

Built for the [make.fun](https://make.fun/c/best-spot-the-difference-game-20261121-0451/)
"Make the best spot the difference game" bounty. MIT licensed.
