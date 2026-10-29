import './style.css';
import { Player } from './entities/Player';
import { Projectile } from './entities/Projectile';
import { Enemy } from './entities/Enemy';
//import { checkProjectileEnemyCollision } from './systems/CollisionSystem';
import { ParticleSystem } from './systems/ParticleSystem';
import { SpawnSystem } from './systems/SpawnSystem';
//import { WaveSystem } from './systems/WaveSystem';
import { EnemyProjectile } from './entities/EnemyProjectile';
//import { checkProjectileEnemyCollision, checkPlayerEnemyCollision } from './systems/CollisionSystem';
import { checkProjectileEnemyCollision, checkPlayerEnemyCollision, checkEnemyProjectilePlayerCollision } from './systems/CollisionSystem';
import { PowerUpSystem } from './systems/PowerUpSystem';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



interface Star {
    x: number;
    y: number;
    speed: number;
    size: number;
}

const stars: Star[] = [];

for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 2,
        size: Math.random() * 2
    });
}

function updateStars() {
    for (const star of stars) {
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function drawStars() {
    for (const star of stars) {
        ctx.fillStyle = `rgba(150, 220, 255, ${0.3 + star.speed / 3})`;

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );
    }
}

const keys = new Set<string>();

window.addEventListener('keydown', (event) => {
    keys.add(event.key.toLowerCase());

    if (event.code === 'Space') {
        keys.add('space');
        event.preventDefault();
    }
});

window.addEventListener('keyup', (event) => {
    keys.delete(event.key.toLowerCase());

    if (event.code === 'Space') {
        keys.delete('space');
    }
});

const player = new Player(canvas.width, canvas.height);
const projectiles: Projectile[] = [];
const enemyProjectiles: EnemyProjectile[] = [];
const enemies: Enemy[] = [];
const particleSystem = new ParticleSystem();
const spawnSystem = new SpawnSystem();
const powerUpSystem = new PowerUpSystem();
//const waveSystem = new WaveSystem();

let score = 0;
const maxShield = 100;
let shield = maxShield;
let gameOver = false;

const HIGH_SCORE_KEY = 'galaxy-remastered-highscore';

function loadHighScore(): number {
    try {
        const value = Number(localStorage.getItem(HIGH_SCORE_KEY));
        return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
        return 0;
    }
}

function saveHighScore() {
    try {
        localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
    } catch {
        // Storage unavailable (private mode, etc.): keep playing without saving
    }
}

let highScore = loadHighScore();
let newHighScore = false;

if (shield <= 0) {
    gameOver = true;
}

let lastShotTime = 0;

const shootCooldown = 150;

function shoot() {
    const now = performance.now();

    if (now - lastShotTime < shootCooldown) {
        return;
    }

    lastShotTime = now;

    for (const offset of powerUpSystem.getShotOffsets()) {
        projectiles.push(
            new Projectile(
                player.x + offset,
                player.y - player.height / 2
            )
        );
    }
}


function drawHUD() {
    ctx.fillStyle = '#00eaff';
    ctx.font = '18px monospace';

    ctx.fillText('GALAXY // REMASTERED', 25, 35);

    ctx.fillStyle = '#ffffff';
    //ctx.fillText('SCORE 000000', 25, 65);
    ctx.fillText(`SCORE ${String(score).padStart(6, '0')}`, 25, 65);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffd000';
    ctx.fillText(
        `HI-SCORE ${String(highScore).padStart(6, '0')}`,
        canvas.width - 25,
        35
    );
    ctx.textAlign = 'left';

    //ctx.fillStyle = '#ff2bd6';
    //ctx.fillText('SHIELD ██████████', 25, 95);
    const filled = Math.round((shield / maxShield) * 10);
    ctx.fillStyle = '#ff2bd6';
    ctx.fillText(`SHIELD ${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`, 25, 95);

    ctx.fillStyle = '#00eaff';
    //ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';

    //ctx.fillText(`WAVE ${waveSystem.getWaveNumber()}`, 20, 30);
    //ctx.fillText(`WAVE ${waveSystem.getWaveNumber()}`, 25, 125);
    //ctx.fillText(`STAGE ${spawnSystem.getStage()}`, 25, 125);
    ctx.fillText(
    `STAGE ${spawnSystem.getStage()}  WAVE ${spawnSystem.getWave()}/${spawnSystem.getTotalWaves()}`,25,125);

    if (powerUpSystem.getWeaponTimeLeft() > 0) {
        ctx.fillStyle = '#ff2bd6';
        ctx.fillText(
            `DOUBLE SHOT ${(powerUpSystem.getWeaponTimeLeft() / 1000).toFixed(1)}s`,
            25,
            155
        );
    }

    if (spawnSystem.isStageComplete()) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00eaff';
        ctx.font = 'bold 40px monospace';
        ctx.fillText('STAGE COMPLETE', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
        ctx.font = '18px monospace';
    }
}

let lastTime = performance.now();

function drawGameOver() {
    ctx.fillStyle = 'rgba(2, 4, 13, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';

    ctx.fillStyle = '#ff2bd6';
    ctx.font = 'bold 56px monospace';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.fillText(
        `FINAL SCORE ${String(score).padStart(6, '0')}`,
        canvas.width / 2,
        canvas.height / 2 + 30
    );

    ctx.fillStyle = '#ffd000';
    ctx.fillText(
        `HI-SCORE ${String(highScore).padStart(6, '0')}`,
        canvas.width / 2,
        canvas.height / 2 + 65
    );

    if (newHighScore) {
        ctx.fillStyle = '#ff2bd6';
        ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 100);
    }

    ctx.fillStyle = '#00eaff';
    ctx.fillText('PRESS R TO RESTART', canvas.width / 2, canvas.height / 2 + 140);

    ctx.textAlign = 'left';
}

function restartGame() {
    score = 0;
    shield = maxShield;
    gameOver = false;
    newHighScore = false;

    enemies.length = 0;
    projectiles.length = 0;
    enemyProjectiles.length = 0;

    player.x = canvas.width / 2;
    player.y = canvas.height - 100;

    //waveSystem.reset();
    spawnSystem.reset();
    powerUpSystem.reset();
}

function gameLoop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (!gameOver) {
        //waveSystem.update(
        spawnSystem.update(
            deltaTime,
            enemies,
            canvas.width
        );
    }

    // Background
    ctx.fillStyle = '#02040d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateStars();
    drawStars();

    if (!gameOver) {
        player.update(keys, canvas.width, canvas.height);
    }
    player.draw(ctx);

    if (keys.has('space') && !gameOver) {
        shoot();
    }

    for (const projectile of projectiles) {
        if (!gameOver) {
            projectile.update();
        }

        if (!projectile.active) {
            continue;
        }

        if (!gameOver) {
            for (const enemy of enemies) {
                if (!enemy.active) {
                    continue;
                }

                if (checkProjectileEnemyCollision(projectile, enemy)) {
                    projectile.active = false;
                    enemy.health -= 1;

                    if (enemy.health <= 0) {
                        score += 100;

                        if (score > highScore) {
                            highScore = score;
                            newHighScore = true;
                        }
                        enemy.active = false;

                        powerUpSystem.maybeDrop(enemy.x, enemy.y);

                        particleSystem.createExplosion(
                            enemy.x,
                            enemy.y
                        );
                    }

                    break;
                }
            }
        }

        if (projectile.active) {
            projectile.draw(ctx);
        }
    }

    const shootInterval = Math.max(3500 - (spawnSystem.getStage() - 1) * 400, 1500);

    for (const enemy of enemies) {
        if (!gameOver) {
            enemy.update();

            if (enemy.y > 0 && enemy.tryShoot(deltaTime, shootInterval)) {
                enemyProjectiles.push(
                    new EnemyProjectile(enemy.x, enemy.y + enemy.height / 2)
                );
            }
        }
        enemy.draw(ctx);
    }

    for (const bullet of enemyProjectiles) {
        if (!gameOver) {
            bullet.update();

            if (bullet.active && checkEnemyProjectilePlayerCollision(bullet, player)) {
                bullet.active = false;
                shield = Math.max(0, shield - 15);

                particleSystem.createExplosion(player.x, player.y);
            }
        }

        if (bullet.active) {
            bullet.draw(ctx);
        }
    }

    if (!gameOver) {
        for (const enemy of enemies) {
            if (!enemy.active) continue;

            if (checkPlayerEnemyCollision(player, enemy)) {
                enemy.active = false;
                shield = Math.max(0, shield - 25);

                particleSystem.createExplosion(enemy.x, enemy.y);
            }
        }

        if (shield <= 0) {
            gameOver = true;
            saveHighScore();
        }
        for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
            if (!enemyProjectiles[i].active) {
                enemyProjectiles.splice(i, 1);
            }
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (!projectiles[i].active) {
            projectiles.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (!enemies[i].active) {
            enemies.splice(i, 1);
        }
    }

    if (!gameOver) {
        const collected = powerUpSystem.update(deltaTime, player);

        for (const type of collected) {
            if (type === 'shield') {
                shield = Math.min(maxShield, shield + 30);
            }
        }
    }
    powerUpSystem.draw(ctx);

    particleSystem.update(deltaTime);
    particleSystem.draw(ctx);

    drawHUD();

    if (gameOver) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('keydown', (event) => {
    if (gameOver && event.key.toLowerCase() === 'r') {
        restartGame();
    }
});

gameLoop();
