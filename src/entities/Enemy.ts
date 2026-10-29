export type EnemyState = 'entering' | 'formation' | 'diving';
export type EnemyType = 'grunt' | 'scout' | 'heavy';

interface EnemyStats {
    health: number;
    width: number;
    height: number;
    speedMultiplier: number; // scales the stage's base enemy speed
    points: number;
    dropMultiplier: number;  // scales the power-up drop chance
    diveWiggle: number;      // sideways swing of the dive S-curve, in px
}

const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
    grunt: { health: 1, width: 46, height: 32, speedMultiplier: 1,   points: 100, dropMultiplier: 1, diveWiggle: 60 },
    scout: { health: 1, width: 38, height: 26, speedMultiplier: 1.4, points: 150, dropMultiplier: 1, diveWiggle: 90 },
    heavy: { health: 3, width: 58, height: 40, speedMultiplier: 0.8, points: 300, dropMultiplier: 3, diveWiggle: 35 }
};

interface EnemyPalette {
    light: string;
    mid: string;
    dark: string;
    outline: string;
    coreGlow: string;
    core: string;
    nodes: string;
}

const ENEMY_PALETTES: Record<EnemyType, EnemyPalette> = {
    grunt: { light: '#ff5c5c', mid: '#8b1020', dark: '#350812', outline: '#ff3b30', coreGlow: '#ffb000', core: '#ffd000', nodes: '#ff6b00' },
    scout: { light: '#ffd24d', mid: '#b36b00', dark: '#4a2a00', outline: '#ffb000', coreGlow: '#ffffff', core: '#fff4b0', nodes: '#ffe066' },
    heavy: { light: '#c77dff', mid: '#5b21b6', dark: '#1e0b3d', outline: '#a855f7', coreGlow: '#ff2bd6', core: '#ff8af0', nodes: '#e879f9' }
};

export class Enemy {
    x: number;
    y: number;

    type: EnemyType;

    width: number;
    height: number;

    // Base speed, set per stage by SpawnSystem. Entry and dive speeds scale from it.
    speed = 2;
    health: number;
    points: number;
    speedMultiplier: number;
    dropMultiplier: number;

    active = true;

    state: EnemyState = 'entering';

    // This enemy's slot in the formation (homeX is the centre of the sway)
    homeX: number;
    homeY: number;

    private diveStartX = 0;
    private diveStartY = 0;
    private diveTargetX = 0;
    private diveDirection = 1;
    private diveWiggle: number;

    // Frames left to flash white after a non-lethal hit
    private hitFlash = 0;

    shootTimer = 1000 + Math.random() * 4000;

    constructor(x: number, y: number, type: EnemyType = 'grunt') {
        const stats = ENEMY_STATS[type];

        this.x = x;
        this.y = y;
        this.homeX = x;
        this.homeY = y;

        this.type = type;
        this.width = stats.width;
        this.height = stats.height;
        this.health = stats.health;
        this.points = stats.points;
        this.speedMultiplier = stats.speedMultiplier;
        this.dropMultiplier = stats.dropMultiplier;
        this.diveWiggle = stats.diveWiggle;
    }

    // swayX:   current horizontal sway of the whole formation
    // playerX: used to aim dives
    update(swayX: number, playerX: number) {
        if (this.hitFlash > 0) {
            this.hitFlash--;
        }

        if (this.state === 'entering') {
            this.updateEntering(swayX);
        } else if (this.state === 'formation') {
            this.x = this.homeX + swayX;
            this.y = this.homeY;
        } else {
            this.updateDiving(swayX, playerX);
        }
    }

    // Apply one laser hit. The caller checks health to see if it was destroyed.
    takeHit() {
        this.health -= 1;
        this.hitFlash = 5;
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
            Math.sin(aim * Math.PI * 2) * this.diveWiggle * this.diveDirection;

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

    private traceBody(ctx: CanvasRenderingContext2D) {
        if (this.type === 'scout') {
            // Narrow dart
            ctx.moveTo(0, 13);
            ctx.lineTo(-19, -3);
            ctx.lineTo(-10, -13);
            ctx.lineTo(0, -7);
            ctx.lineTo(10, -13);
            ctx.lineTo(19, -3);
        } else {
            // Grunt body (the heavy uses the same shape, scaled up)
            ctx.moveTo(-23, -8);
            ctx.lineTo(-10, -16);
            ctx.lineTo(0, -10);
            ctx.lineTo(10, -16);
            ctx.lineTo(23, -8);
            ctx.lineTo(16, 10);
            ctx.lineTo(0, 15);
            ctx.lineTo(-16, 10);
        }

        ctx.closePath();
    }

    draw(ctx: CanvasRenderingContext2D) {
        const palette = ENEMY_PALETTES[this.type];
        const flashing = this.hitFlash > 0;

        ctx.save();

        ctx.translate(this.x, this.y);

        if (this.type === 'heavy') {
            ctx.scale(1.25, 1.25);
        }

        // Enemy glow
        ctx.shadowColor = flashing ? '#ffffff' : palette.outline;
        ctx.shadowBlur = 18;

        // Main body
        ctx.beginPath();
        this.traceBody(ctx);

        if (flashing) {
            ctx.fillStyle = '#ffffff';
        } else {
            const bodyGradient = ctx.createLinearGradient(0, -16, 0, 16);

            bodyGradient.addColorStop(0, palette.light);
            bodyGradient.addColorStop(0.5, palette.mid);
            bodyGradient.addColorStop(1, palette.dark);

            ctx.fillStyle = bodyGradient;
        }

        ctx.fill();

        // Neon outline
        ctx.strokeStyle = flashing ? '#ffffff' : palette.outline;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Armor plating on the heavy
        if (this.type === 'heavy') {
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-12, -12);
            ctx.lineTo(-6, 10);
            ctx.moveTo(12, -12);
            ctx.lineTo(6, 10);
            ctx.stroke();
        }

        // Energy core
        ctx.shadowColor = palette.coreGlow;
        ctx.shadowBlur = 15;

        const coreY = this.type === 'scout' ? -2 : 0;
        const coreRadius = this.type === 'scout' ? 4 : 5;

        ctx.beginPath();
        ctx.arc(0, coreY, coreRadius, 0, Math.PI * 2);

        ctx.fillStyle = palette.core;
        ctx.fill();

        // Side energy nodes
        const nodeX = this.type === 'scout' ? 12 : 15;
        const nodeY = this.type === 'scout' ? -4 : 3;

        ctx.fillStyle = palette.nodes;

        ctx.beginPath();
        ctx.arc(-nodeX, nodeY, 3, 0, Math.PI * 2);
        ctx.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
