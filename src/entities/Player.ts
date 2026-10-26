

export class Player {
    x: number;
    y: number;

    width = 40;
    height = 60;
    speed = 6;

    constructor(
        private canvasWidth: number,
        private canvasHeight: number
    ) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 100;
    }

    update(
        keys: Set<string>,
        canvasWidth: number,
        canvasHeight: number
    ) {
        if (keys.has('arrowleft') || keys.has('a')) {
            this.x -= this.speed;
        }

        if (keys.has('arrowright') || keys.has('d')) {
            this.x += this.speed;
        }

        if (keys.has('arrowup') || keys.has('w')) {
            this.y -= this.speed;
        }

        if (keys.has('arrowdown') || keys.has('s')) {
            this.y += this.speed;
        }

        // Keep ship inside the screen
        this.x = Math.max(this.width / 2, this.x);
        this.x = Math.min(canvasWidth - this.width / 2, this.x);

        this.y = Math.max(this.height / 2, this.y);
        this.y = Math.min(canvasHeight - this.height / 2, this.y);
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.save();

        ctx.translate(this.x, this.y);

        // Engine glow
        const gradient = ctx.createRadialGradient(
            0,
            30,
            2,
            0,
            30,
            25
        );

        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(0.4, '#0088ff');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(-25, 15, 50, 45);

        // Ship body
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(20, 25);
        ctx.lineTo(0, 15);
        ctx.lineTo(-20, 25);
        ctx.closePath();

        ctx.fillStyle = '#101d35';
        ctx.fill();

        // Neon outline
        ctx.strokeStyle = '#00eaff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00eaff';
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Cockpit
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(7, 5);
        ctx.lineTo(-7, 5);
        ctx.closePath();

        ctx.fillStyle = '#ff2bd6';
        ctx.fill();

        ctx.restore();
    }
}
