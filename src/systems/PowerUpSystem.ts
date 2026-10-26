import { PowerUp } from '../entities/PowerUp';
import type { PowerUpType } from '../entities/PowerUp';
import { Player } from '../entities/Player';
import { checkPlayerPowerUpCollision } from './CollisionSystem';

export class PowerUpSystem {
    private powerUps: PowerUp[] = [];

    // Chance that a destroyed enemy drops a power-up
    private readonly dropChance = 0.1;

    // Double-shot duration in milliseconds
    private readonly weaponDuration = 10000;
    private weaponTimeLeft = 0;

    maybeDrop(x: number, y: number) {
        if (Math.random() > this.dropChance) {
            return;
        }

        const type: PowerUpType = Math.random() < 0.5 ? 'shield' : 'weapon';
        this.powerUps.push(new PowerUp(x, y, type));
    }

    // Returns the types collected this frame so the caller can apply
    // effects it owns (for example, restoring shield).
    update(deltaTime: number, player: Player): PowerUpType[] {
        const collected: PowerUpType[] = [];

        if (this.weaponTimeLeft > 0) {
            this.weaponTimeLeft = Math.max(0, this.weaponTimeLeft - deltaTime);
        }

        for (const powerUp of this.powerUps) {
            powerUp.update(deltaTime);

            if (powerUp.active && checkPlayerPowerUpCollision(player, powerUp)) {
                powerUp.active = false;
                collected.push(powerUp.type);

                if (powerUp.type === 'weapon') {
                    this.weaponTimeLeft = this.weaponDuration;
                }
            }
        }

        this.powerUps = this.powerUps.filter(p => p.active);

        return collected;
    }

    // Horizontal offsets (from the ship centre) for each laser fired
    getShotOffsets(): number[] {
        return this.weaponTimeLeft > 0 ? [-10, 10] : [0];
    }

    getWeaponTimeLeft() {
        return this.weaponTimeLeft;
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const powerUp of this.powerUps) {
            powerUp.draw(ctx);
        }
    }

    reset() {
        this.powerUps.length = 0;
        this.weaponTimeLeft = 0;
    }
}
