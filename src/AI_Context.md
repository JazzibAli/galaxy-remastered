# Galaxy Remastered — AI Context

## IMPORTANT

Read this file before modifying the project.

Galaxy Remastered is an original futuristic arcade space
shooter inspired by the feel and gameplay principles of
classic retro Galaxy-style arcade games.

This project is a reimagining, not a direct asset/code copy.

---

## Project Status

Current phase: Phase 3 — Arcade Gameplay (Phase 2 complete)

The game currently has:

- Vite project, TypeScript, HTML5 Canvas
- Animated starfield and neon HUD (score, high score, shield bar, stage/wave)
- Player ship with WASD/arrow movement and Space to fire (with cooldown)
- Stage system: stages contain waves, with a "STAGE COMPLETE" pause
- Enemies fly into a swaying formation (entering / formation / diving states)
- Galaxian-style S-curve dive attacks aimed at the player; divers re-enter from the top and rejoin the formation
- Difficulty scaling per stage: bigger formations, faster enemies, more waves, more frequent and more simultaneous dives, faster fire
- Enemy projectiles (enemies shoot at the player)
- Collision detection (player lasers vs enemies, enemies vs player, enemy bullets vs player, player vs power-ups)
- Explosions and particles
- Score and shield systems
- Power-ups: shield repair and timed double shot (10% drop chance on kill)
- Persistent high score (localStorage)
- Three enemy types: grunt (red, 1 hit, 100 pts), scout (amber, fast, wide dive swing, 150 pts), heavy (violet, 3 hits, slow, 300 pts, 3x power-up drop chance). Types are assigned per formation row by stage (stage 1 grunts only, stage 2 scouts lead, stage 3+ heavies lead). Stats live in the table at the top of Enemy.ts.
- Combo scoring: each kill within 3 s of the last extends a streak; the multiplier is x1 + 1 per 4 kills, capped at x5. Taking a hit (bullet or ramming) or letting the timer expire resets it. Logic lives in ComboSystem; the HUD shows `COMBO xN` and a draining timer bar at the top right.
- Game over screen and restart (R)

Not implemented yet:

- Permanent weapon and shield upgrades, special ability
- Bosses
- Audio
- Menus
- Save/progression system (beyond high score)

---

## Technology

Primary technologies:

- TypeScript
- Vite
- HTML5 Canvas
- CSS
- Node.js
- npm

Current Node.js version used during development:

v24.20.0

---

## Development Philosophy

The project should remain:

- Modular
- Maintainable
- Performant
- Easy to understand
- Easy for another developer or AI to continue

Do not put the entire game into one source file.

As the project grows, separate systems and entities
into appropriate modules.

Avoid unnecessary dependencies.

Prefer simple solutions unless a more advanced solution
provides a clear benefit.

---

## Visual Direction

The visual identity is:

- Futuristic
- Retro-inspired
- Neon
- Dark space environments
- Cyan and magenta energy colors
- Glowing effects
- High contrast
- Arcade presentation
- Modern particle effects

The game should feel like:

"Classic arcade space combat redesigned for a futuristic era."

---

## Gameplay Direction

Core gameplay:

MOVE
↓
DODGE
↓
SHOOT
↓
DESTROY
↓
COLLECT
↓
UPGRADE
↓
ADVANCE

The game should remain fast, responsive and arcade-focused.

Modern systems may be added without making the basic
gameplay unnecessarily complicated.

---

## Architecture Direction

The intended architecture will eventually contain:

- Game/core systems
- Entities
- Rendering
- Gameplay systems
- Levels
- Audio
- UI
- Configuration
- Assets

Do not create large numbers of files prematurely.

Refactor when a system becomes sufficiently complex.

---

## Current Source Structure

src/main.ts            game loop, input, starfield, HUD, shooting
src/style.css
src/entities/          Player, Enemy, Projectile, EnemyProjectile, PowerUp
src/systems/           CollisionSystem, ParticleSystem, SpawnSystem, PowerUpSystem, ComboSystem
                       (WaveSystem.ts is unused, replaced by SpawnSystem)

main.ts still holds the starfield, HUD, input and shooting code.
Extract these into modules (for example Starfield, HUD, InputManager)
as they grow.

---

## Current Objective

Phase 3 remaining work:

1. Permanent weapon and shield upgrades
2. Special ability

---

## AI Working Rules

When modifying the project:

1. Read this file first.
2. Inspect existing code before changing it.
3. Preserve working functionality.
4. Avoid unnecessary rewrites.
5. Explain significant architectural changes.
6. Update documentation when major decisions change.
7. Update TODO.md when tasks are completed.
8. Update CHANGELOG.md after meaningful milestones.
9. Keep the game playable after each major change.
10. Never assume an old system can be deleted without checking
   how other systems depend on it.

---

## Handoff Rule

If another AI continues this project, it should:

1. Read AI_CONTEXT.md
2. Read PROJECT.md
3. Read TODO.md
4. Read the latest CHANGELOG.md entry
5. Inspect the current src/ directory
6. Determine the current working state
7. Continue from the existing architecture

Do not restart the project from scratch unless explicitly requested.
