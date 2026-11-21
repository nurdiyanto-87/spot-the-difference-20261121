# Build log — Two Gardens (spot-the-difference-20261121)

Competition: best-spot-the-difference-game-20261121-0451 (opened 2026-11-21 11:51 WIB).
Built in a fresh session after opening. No credentials used; nothing submitted
by this session (parent verifies and submits).

## What was built

An original spot-the-difference game, "Two Gardens": two near-identical
garden pictures side by side, drawn procedurally on canvas (no assets,
no network). Three levels with rising difficulty — Morning Garden (7
differences, 180s), Pond at Noon (8, 150s), Twilight Meadow (9, 120s).
Click a difference in either panel (green circle + check marker on both),
wrong clicks cost 20 points, H spends a hint (pulsing yellow ring, −50),
timer bar + "Found n / m" counter + "n still hiding" in the HUD, keyboard
play via crosshair (arrows + Enter, Tab switches panel), synthesized
WebAudio sounds, title / level-clear / game-over / victory screens.

## Files

- `main.ts` — entrypoint: copies game/ + screenshots/ to /output, writes dossier.json
- `serve.ts` — local static server for play-testing only
- `vendor/makefun-game.ts` — kit copy, unchanged (sha256 verified identical)
- `LICENSE` — MIT, SPDX-License-Identifier: MIT on the first line
- `.makefun/owner.json` — {"wallet": "AS58ZTPHWqxS6UD9cezzsGVrP7EYTLsXMqbaLYM1JDka"}
- `game/index.html`, `game/styles.css`
- `game/src/config.js` — layout constants, palettes, scoring
- `game/src/painter.js` — procedural scene art + base scene
- `game/src/levels.js` — 3 levels, 24 differences (per-side draw functions)
- `game/src/state.js` — rules: timer, scoring, hints, screens
- `game/src/render.js` — HUD, panels, markers, overlays
- `game/src/input.js` — mouse + keyboard
- `game/src/audio.js` — synthesized sounds (WebAudio, no files)
- `game/src/main.js` — bootstrap, loop, `window.__spotGame` play-test hook
- `screenshots/` — 4 real renders (cover first by name):
  `1-playing.jpg` (cover: 3 found, 4 still hiding, counter visible),
  `2-title.jpg`, `3-hint.jpg`, `4-level-clear.jpg` — all 1280x800 JPEG, <100 KiB

## Tests run

- `node serve.ts` + Playwright (headless Chromium) play-test
  (`/tmp/pwtest/shots.mjs`): title → Enter starts level 1; 3 mouse clicks
  found 3 differences (score 300); hint spent (score 250, ring shown);
  remaining 4 clicked → levelComplete, score 5325; Enter advances to
  level 2; keyboard crosshair + Enter found a difference. Zero console
  errors, zero non-local network requests.
- Full playthrough (`/tmp/pwtest/full.mjs` + victory check): all 3 levels
  cleared by clicking the right panel (7/7, 8/8, 9/9), scores 5400 →
  10150 → 14250; Enter after level 3 → victory screen; R restarts.
- `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`: out/ holds
  game/, screenshots/ (4 files), dossier.json (533,139 bytes, < 1.5 MiB
  cap). Ran twice: dossier byte-identical across runs. No symlinks in
  game/ or screenshots/; no http(s) references in game files; screenshots
  1280x800 (long side ≤1280, short side ≥480), each ≤256 KiB.

## Bug found and fixed during testing

`drawDaisy` was called with (petals, center) but defined with an extra
leading scale parameter, so the centre circle rendered at 6x size (giant
orange blobs at the bottom of the panels). Fixed by dropping the unused
scale parameter from the function signature; re-tested with fresh
screenshots (verified visually + by pixel scan).
