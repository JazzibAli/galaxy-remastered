# Galaxy Remastered — Changelog

## 2026-10-26 — Combo Scoring

### Added

- `ComboSystem` (`src/systems/ComboSystem.ts`): kill-streak multiplier.
- Each kill within 3 seconds of the previous one extends the streak and refreshes the timer.
- Multiplier is x1, plus one level per 4 kills, capped at x5. A kill is scored with the multiplier shown at that moment, then the streak grows.
- The combo resets when the timer runs out, when an enemy bullet hits the player, and when the player rams an enemy.
- HUD shows `COMBO xN` with a draining timer bar at the top right, only while a streak is active.
- Combo resets on restart and is paused while the game is over.

### Changed

- Kill score is now `enemy.points * multiplier`.

### Next Milestone

Permanent weapon and shield upgrades, then a special ability.

## 2026-10-26 — Multiple Enemy Types

### Added

- `EnemyType`: `grunt`, `scout`, `heavy`, with stats and palettes in tables at the top of `Enemy.ts`.
- Grunt (red): 1 hit, 100 points. The original enemy.
- Scout (amber dart): 1 hit, 150 points, 1.4x speed, wide dive swing.
- Heavy (violet armored): 3 hits, 300 points, 0.8x speed, narrow dive swing, 3x power-up drop chance.
- `SpawnSystem.getEnemyType()` assigns types by formation row and stage: stage 1 grunts only, stage 2 scouts lead, stage 3+ heavies lead with scouts behind.
- `Enemy.takeHit()` with a white hit flash, plus a small spark burst on non-lethal hits.
- `PowerUpSystem.maybeDrop()` takes an optional drop-chance multiplier.

### Changed

- Score per kill is now `enemy.points` instead of a flat 100.
- Enemy size (`width`, `height`) comes from the type, so collisions match each shape.

### Next Milestone

Combo scoring, then permanent weapon and shield upgrades.

## 2026-10-26 — Formations and Dive Attacks (restored)

The `Enemy.ts` and `SpawnSystem.ts` shared this session did not contain the
formation work described in the 2026-10-07 entry (enemies flew straight down),
so it was rebuilt.

### Added

- `Enemy` now has `entering`, `formation` and `diving` states, with a home slot (`homeX`, `homeY`).
- Enemies fly in from above (V-shaped entrance), then hold a swaying formation.
- `SpawnSystem` owns the shared sway (`getSwayX()`) and launches dives on a timer.
- Dives: an enemy breaks formation, aims at the player, then commits to its course (S-curve). If it misses it re-enters from the top and rejoins the formation.
- Dive frequency and the number of simultaneous divers scale with the stage.
- Enemies only fire in `formation` or `diving` state. Divers fire at the full rate, formation enemies at a quarter of it.

### Changed

- Enemies are no longer removed for leaving the screen; a wave ends only when all its enemies are destroyed.
- `main.ts`: `enemy.update()` is now `enemy.update(spawnSystem.getSwayX(), player.x)`.
- `SpawnSystem.ts`: removed the large commented-out legacy class.

### Next Milestone

Multiple enemy types.

## 2026-10-26 — High Score

### Added

- Added a persistent high score saved in `localStorage` (key `galaxy-remastered-highscore`).
- HUD shows `HI-SCORE` in the top-right corner and updates live when beaten.
- Game-over screen shows the high score and a `NEW HIGH SCORE!` line when beaten.
- Storage access is wrapped in try/catch, so the game still runs if storage is unavailable.

### Next Milestone

Multiple enemy types (pending current `Enemy.ts` / `SpawnSystem.ts`).

## 2026-10-26 — Power-ups

### Added

- Added `PowerUp` entity (`src/entities/PowerUp.ts`): falling pickups with a pulsing neon diamond look.
- Added `PowerUpSystem` (`src/systems/PowerUpSystem.ts`): drops, movement, pickup, and the double-shot timer.
- Destroyed enemies have a 10% chance to drop a power-up (50/50 shield or weapon).
- Shield power-up (green `+`): restores 30 shield, capped at max.
- Weapon power-up (magenta `W`): double shot for 10 seconds; picking another refreshes the timer.
- Added `checkPlayerPowerUpCollision` to `CollisionSystem`.
- HUD shows a `DOUBLE SHOT` countdown while active.
- Power-ups and the weapon timer reset on restart.

### Next Milestone

Multiple enemy types and a saved high score.

## 2026-10-07 — Stages, Formations and Enemy Attacks

### Added

- Rebuilt `SpawnSystem` as the permanent stage manager (`WaveSystem` was a temporary stand-in and is now unused).
- Added stages made of waves, with a "STAGE COMPLETE" pause between stages.
- Added difficulty scaling per stage: bigger formations, faster enemies, more waves, more frequent fire and dives.
- Added swaying enemy formations with `entering`, `formation` and `diving` states.
- Added Galaxian-style dive attacks: enemies break off in an S-curve toward the player, then re-enter from the top and rejoin the formation.
- Added `EnemyProjectile`: enemies now fire bullets at the player.
- Added score system (100 points per kill).
- Added player-enemy collision (`checkPlayerEnemyCollision`) and enemy-bullet collision (`checkEnemyProjectilePlayerCollision`).
- Added shield system with a live HUD bar (ramming costs 25, bullets cost 15).
- Added game-over state with final score screen.
- Added restart on R key, with `SpawnSystem.reset()`.
- HUD now shows `STAGE x  WAVE y/z`.

### Current State

Phase 2 is complete. The game is a full, losable arcade loop:
move, dodge, shoot, destroy, score, take damage, game over, restart.

Stages contain waves. Enemies hold a swaying formation, dive at the player, and shoot.

### Next Milestone

Power-ups, multiple enemy types, and a saved high score.

## 2026-09-02 — Enemy Spawning System

### Added

- Created `SpawnSystem`.
- Added automatic enemy spawning.
- Added randomized enemy horizontal positions.
- Added timed enemy generation.
- Removed manual enemy creation from the game loop.
- Connected spawning to the main game loop.

### Current State

The game now continuously generates enemies.

The player can:

- Move
- Fire lasers
- Destroy enemies
- Trigger explosions
- Continue fighting newly spawned enemies

The basic arcade gameplay loop is now functional.

### Next Milestone

Introduce enemy formations and wave-based gameplay.


## 2026-09-02 — Project Initialization

### Added

- Created Vite + TypeScript project.
- Configured Node.js development environment.
- Created HTML5 Canvas game.
- Added full-screen rendering.
- Added animated starfield.
- Added futuristic player spaceship.
- Added WASD movement.
- Added arrow-key movement.
- Added screen boundary limits.
- Added basic HUD.
- Established neon cyan/magenta visual direction.

### Documentation

Created:

- README.md
- PROJECT.md
- AI_CONTEXT.md
- TODO.md
- CHANGELOG.md

### Current State

The game is currently a playable movement prototype.

The player can move around a futuristic starfield.

No combat system exists yet.
