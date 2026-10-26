import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Enemy } from '../entities/Enemy';
import { EnemyProjectile } from '../entities/EnemyProjectile';
import { PowerUp } from '../entities/PowerUp';

export function checkProjectileEnemyCollision(
    projectile: Projectile,
    enemy: Enemy
): boolean {
    const projectileLeft = projectile.x - projectile.width / 2;
    const projectileRight = projectile.x + projectile.width / 2;
    const projectileTop = projectile.y;
    const projectileBottom = projectile.y + projectile.height;

    const enemyLeft = enemy.x - enemy.width / 2;
    const enemyRight = enemy.x + enemy.width / 2;
    const enemyTop = enemy.y - enemy.height / 2;
    const enemyBottom = enemy.y + enemy.height / 2;

    return (
        projectileLeft < enemyRight &&
        projectileRight > enemyLeft &&
        projectileTop < enemyBottom &&
        projectileBottom > enemyTop
    );
}

export function checkPlayerEnemyCollision(
    player: Player,
    enemy: Enemy
): boolean {
    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;
    const playerTop = player.y - player.height / 2;
    const playerBottom = player.y + player.height / 2;

    const enemyLeft = enemy.x - enemy.width / 2;
    const enemyRight = enemy.x + enemy.width / 2;
    const enemyTop = enemy.y - enemy.height / 2;
    const enemyBottom = enemy.y + enemy.height / 2;

    return (
        playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop
    );
}



export function checkEnemyProjectilePlayerCollision(
    projectile: EnemyProjectile,
    player: Player
): boolean {
    const projectileLeft = projectile.x - projectile.width / 2;
    const projectileRight = projectile.x + projectile.width / 2;
    const projectileTop = projectile.y;
    const projectileBottom = projectile.y + projectile.height;

    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;
    const playerTop = player.y - player.height / 2;
    const playerBottom = player.y + player.height / 2;

    return (
        projectileLeft < playerRight &&
        projectileRight > playerLeft &&
        projectileTop < playerBottom &&
        projectileBottom > playerTop
    );
}

export function checkPlayerPowerUpCollision(
    player: Player,
    powerUp: PowerUp
): boolean {
    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;
    const playerTop = player.y - player.height / 2;
    const playerBottom = player.y + player.height / 2;

    const powerUpLeft = powerUp.x - powerUp.width / 2;
    const powerUpRight = powerUp.x + powerUp.width / 2;
    const powerUpTop = powerUp.y - powerUp.height / 2;
    const powerUpBottom = powerUp.y + powerUp.height / 2;

    return (
        playerLeft < powerUpRight &&
        playerRight > powerUpLeft &&
        playerTop < powerUpBottom &&
        playerBottom > powerUpTop
    );
}
