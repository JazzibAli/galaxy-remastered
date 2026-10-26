export type PowerUpType = 'shield' | 'weapon';

const COLORS: Record<PowerUpType, string> = {
    shield: '#00ff9c',
    weapon: '#ff2bd6'
};

const LABELS: Record<PowerUpType, string> = {
    shield: '+',
    weapon: 'W'
};

export class PowerUp {
    x: number;
    y: number;
    type: PowerUpType;

    width = 30;
    height = 30;
    speed = 2.5;

    active = true;

    private age = 0;

    constructor(x: number, y: number, type: PowerUpType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    update(deltaTime: number) {
        this.y += this.speed;
        this.age += deltaTime;

        // Deactivate when it leaves the screen
        if (this.y - this.height > window.innerHeight) {
            this.active = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const color = COLORS[this.type];
        const pulse = 1 + Math.sin(this.age / 150) * 0.12;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(pulse, pulse);

        ctx.shadowColor = color;
        ctx.shadowBlur = 20;

        // Diamond shell
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(16, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(-16, 0);
        ctx.closePath();

        ctx.fillStyle = '#0a1226';
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(LABELS[this.type], 0, 1);

        ctx.restore();
    }
}
