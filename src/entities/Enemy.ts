export type EnemyState = 'entering' | 'formation' | 'diving';

export class Enemy {
    x: number;
    y: number;

    width = 46;
    height = 32;

    // Base speed, set per stage by SpawnSystem. Entry and dive speeds scale from it.
    speed = 2;
    health = 1;

    active = true;

    state: EnemyState = 'entering';

    // This enemy's slot in the formation (homeX is the centre of the sway)
    homeX: number;
    homeY: number;

    private diveStartX = 0;
    private diveStartY = 0;
    private diveTargetX = 0;
    private diveDirection = 1;

    shootTimer = 1000 + Math.random() * 4000;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.homeX = x;
        this.homeY = y;
    }

    // swayX:   current horizontal sway of the whole formation
    // playerX: used to aim dives
    update(swayX: number, playerX: number) {
        if (this.state === 'entering') {
            this.updateEntering(swayX);
        } else if (this.state === 'formation') {
            this.x = this.homeX + swayX;
            this.y = this.homeY;
        } else {
            this.updateDiving(swayX, playerX);
        }
    }

    // Break away from the formation and attack
    startDive() {
        this.state = 'diving';
        this.diveStartX = this.x;
        this.diveStartY = this.y;
        this.diveTargetX = this.x;
        this.diveDirection = Math.random() < 0.5 ? 1 : -1;

        // Divers open fire soon after leaving the formation
        this.shootTimer = Math.min(this.shootTimer, 250 + Math.random() * 500);
    }

    private updateEntering(swayX: number) {
        this.x = this.homeX + swayX;
        this.y += 4 + this.speed * 2;

        if (this.y >= this.homeY) {
            this.y = this.homeY;
            this.state = 'formation';
        }
    }

    private updateDiving(swayX: number, playerX: number) {
        const screenHeight = window.innerHeight;

        this.y += 3 + this.speed * 1.5;

        // 0 at the start of the dive, 1 when leaving the bottom of the screen
        const distance = screenHeight + this.height / 2 - this.diveStartY;
        const progress = Math.min(1, (this.y - this.diveStartY) / distance);

        // Keep aiming at the player, then commit so the player can dodge
        if (progress < 0.55) {
            this.diveTargetX = playerX;
        }

        // Reach the target x around the player's height, then fall straight
        const aim = Math.min(1, progress / 0.85);

        // S-curve: veer to one side, swing back, arrive over the target
        this.x =
            this.diveStartX +
            (this.diveTargetX - this.diveStartX) * aim +
            Math.sin(aim * Math.PI * 2) * 60 * this.diveDirection;

        this.x = Math.max(
            this.width / 2,
            Math.min(window.innerWidth - this.width / 2, this.x)
        );

        // Left the bottom: re-enter from the top and rejoin the formation
        if (this.y - this.height / 2 > screenHeight) {
            this.state = 'entering';
            this.y = -this.height;
            this.x = this.homeX + swayX;
        }
    }

    // Returns true when the enemy wants to fire this frame
    tryShoot(deltaTime: number, interval: number): boolean {
        // Enemies only fire once they are in formation or diving
        if (this.state === 'entering') {
            return false;
        }

        this.shootTimer -= deltaTime;

        if (this.shootTimer <= 0) {
            // Formation enemies fire rarely, divers at the full rate
            const scale = this.state === 'diving' ? 1 : 4;
            this.shootTimer = interval * scale * (0.7 + Math.random() * 0.6);
            return true;
        }

        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(this.x, this.y);

        // Enemy glow
        ctx.shadowColor = '#ff3b30';
        ctx.shadowBlur = 18;

        // Main body
        ctx.beginPath();

        ctx.moveTo(-23, -8);
        ctx.lineTo(-10, -16);
        ctx.lineTo(0, -10);
        ctx.lineTo(10, -16);
        ctx.lineTo(23, -8);
        ctx.lineTo(16, 10);
        ctx.lineTo(0, 15);
        ctx.lineTo(-16, 10);

        ctx.closePath();

        const bodyGradient = ctx.createLinearGradient(
            0,
            -16,
            0,
            16
        );

        bodyGradient.addColorStop(0, '#ff5c5c');
        bodyGradient.addColorStop(0.5, '#8b1020');
        bodyGradient.addColorStop(1, '#350812');

        ctx.fillStyle = bodyGradient;
        ctx.fill();

        // Neon outline
        ctx.strokeStyle = '#ff3b30';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Energy core
        ctx.shadowColor = '#ffb000';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);

        ctx.fillStyle = '#ffd000';
        ctx.fill();

        // Side energy nodes
        ctx.fillStyle = '#ff6b00';

        ctx.beginPath();
        ctx.arc(-15, 3, 3, 0, Math.PI * 2);
        ctx.arc(15, 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
