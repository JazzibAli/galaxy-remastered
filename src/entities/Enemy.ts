export class Enemy {
    x: number;
    y: number;

    width = 46;
    height = 32;

    speed = 2;
    health = 1;

    active = true;

    shootTimer = 1000 + Math.random() * 4000;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.y += this.speed;

        // Remove enemy after it leaves the screen
        if (this.y - this.height > window.innerHeight) {
            this.active = false;
        }
    }

    // Returns true when the enemy wants to fire this frame
    tryShoot(deltaTime: number, interval: number): boolean {
        this.shootTimer -= deltaTime;

        if (this.shootTimer <= 0) {
            this.shootTimer = interval * (0.7 + Math.random() * 0.6);
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
