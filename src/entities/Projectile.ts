export class Projectile {
    x: number;
    y: number;

    width = 4;
    height = 18;
    speed = 12;

    active = true;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.y -= this.speed;

        // Deactivate when it leaves the screen
        if (this.y + this.height < 0) {
            this.active = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        // Outer glow
        ctx.shadowColor = '#00eaff';
        ctx.shadowBlur = 15;

        // Laser
        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x,
            this.y + this.height
        );

        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, '#00ffff');
        gradient.addColorStop(1, '#0088ff');

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
