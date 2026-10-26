interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

export class ParticleSystem {
    private particles: Particle[] = [];

    createExplosion(
        x: number,
        y: number,
        count = 20
    ) {
        const colors = [
            '#ff3b30',
            '#ff6b00',
            '#ffd000',
            '#ff2bd6'
        ];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;

            const maxLife = 300 + Math.random() * 400;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife,
                size: 2 + Math.random() * 4,
                color: colors[
                    Math.floor(Math.random() * colors.length)
                ]
            });
        }
    }

    update(deltaTime: number) {
        for (const particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.vx *= 0.98;
            particle.vy *= 0.98;

            particle.life -= deltaTime;
        }

        this.particles = this.particles.filter(
            particle => particle.life > 0
        );
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const particle of this.particles) {
            const alpha =
                particle.life / particle.maxLife;

            ctx.save();

            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;

            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }
}
