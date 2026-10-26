export class EnemyProjectile {
    x: number;
    y: number;

    width = 6;
    height = 16;
    speed = 5;

    active = true;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.y += this.speed;

        // Deactivate when it leaves the screen
        if (this.y > window.innerHeight) {
            this.active = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.shadowColor = '#ff2bd6';
        ctx.shadowBlur = 15;

        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x,
            this.y + this.height
        );

        gradient.addColorStop(0, '#0088ff');
        gradient.addColorStop(0.5, '#ff2bd6');
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;

        ctx.fillRect(
            this.x - this.width / 2,
            this.y,
            this.width,
            this.height
        );

        ctx.restore();
    }
}