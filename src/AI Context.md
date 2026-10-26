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
- Animated starfield and neon HUD (score, shield bar, stage/wave)
- Player ship with WASD/arrow movement and Space to fire (with cooldown)
- Stage system: stages contain waves, with a "STAGE COMPLETE" pause
- Swaying enemy formations with entering, formation and diving states
- Galaxian-style dive attacks and enemy projectiles
- Collision detection (player lasers vs enemies, enemies vs player, enemy bullets vs player)
- Explosions and particles
- Score and shield systems
- Game over screen and restart (R)

Not implemented yet:

- Power-ups and upgrades
- Multiple enemy types
- Bosses
- Audio
- Menus
- Save/progression system
- High score

Current phase: Phase 1 — Prototype

The game currently has:

- Vite project
- TypeScript
- HTML5 Canvas
- Full-screen game canvas
- Animated starfield
- Player spaceship
- WASD movement
- Arrow-key movement
- Screen boundary limits
- Basic futuristic HUD
- Neon cyan/magenta visual style

Not implemented yet:

- Player weapons
- Projectiles
- Enemies
- Enemy spawning
- Collision detection
- Damage system
- Score system
- Power-ups
- Levels
- Bosses
- Audio
- Menus
- Save/progression system

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

Current important files:

src/main.ts
src/style.css

At this early prototype stage, some functionality is
still intentionally contained in main.ts.

This is temporary.

As combat and gameplay systems are added, the code should
be progressively separated into modules.

---

## Current Objective

Build the first combat prototype.

Required sequence:

1. Player weapon
2. Projectile
3. Enemy
4. Enemy spawning
5. Projectile/enemy collision
6. Enemy destruction
7. Score
8. Player damage
9. Game over
10. Restart

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
