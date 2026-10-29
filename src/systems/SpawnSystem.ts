import { Enemy } from '../entities/Enemy';

export class SpawnSystem {
    private stage = 1;
    private wave = 0; // waves started in the current stage
    private waveTimer = 0;
    private readonly waveDelay = 1500;

    private stageComplete = false;
    private stageTimer = 0;
    private readonly stageDelay = 2500;

    // Formation layout
    private readonly formationTop = 190; // clear of the HUD text
    private readonly rowSpacing = 50;

    // Formation sway
    private swayTime = 0;
    private readonly swayAmplitude = 30;
    private readonly swaySpeed = 0.0015; // radians per millisecond

    // Dive attacks
    private diveTimer = 0;
    private nextDiveTime = 3000;

    update(
        deltaTime: number,
        enemies: Enemy[],
        canvasWidth: number
    ) {
        this.swayTime += deltaTime;

        // Pause between stages
        if (this.stageComplete) {
            this.stageTimer += deltaTime;

            if (this.stageTimer >= this.stageDelay) {
                this.stage++;
                this.wave = 0;
                this.waveTimer = 0;
                this.stageTimer = 0;
                this.stageComplete = false;
            }
            return;
        }

        // Wave in progress: enemies hold formation and dive until all are destroyed
        if (enemies.length > 0) {
            this.waveTimer = 0;
            this.updateDives(deltaTime, enemies);
            return;
        }

        // Last wave cleared: stage complete
        if (this.wave >= this.getWavesInStage()) {
            this.stageComplete = true;
            this.stageTimer = 0;
            return;
        }

        // Short pause, then start the next wave
        this.waveTimer += deltaTime;

        if (this.waveTimer >= this.waveDelay) {
            this.waveTimer = 0;
            this.wave++;
            this.spawnWave(enemies, canvasWidth);
        }
    }

    private spawnWave(enemies: Enemy[], canvasWidth: number) {
        const rows = Math.min(2 + Math.floor(this.stage / 2), 4);
        const enemiesPerRow = Math.min(4 + this.stage, 9);

        const horizontalSpacing = Math.min(
            80,
            (canvasWidth - 120) / enemiesPerRow
        );

        const totalWidth = (enemiesPerRow - 1) * horizontalSpacing;
        const startX = canvasWidth / 2 - totalWidth / 2;
        const centerColumn = (enemiesPerRow - 1) / 2;

        const speed = Math.min(1.5 + (this.stage - 1) * 0.25, 4);

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < enemiesPerRow; column++) {
                const homeX = startX + column * horizontalSpacing;

                // Row 0 enters first, so it takes the lowest slot and
                // later rows fill the slots above without crossing it
                const homeY =
                    this.formationTop + (rows - 1 - row) * this.rowSpacing;

                // Start above the screen; the centre enters first,
                // giving a V-shaped entrance
                const stagger = Math.abs(column - centerColumn) * 20;
                const enemy = new Enemy(homeX, -60 - row * 55 - stagger);

                enemy.homeX = homeX;
                enemy.homeY = homeY;
                enemy.speed = speed;

                enemies.push(enemy);
            }
        }

        // First dive of the wave comes after a short delay
        this.diveTimer = 0;
        this.nextDiveTime = this.getDiveInterval();
    }

    private updateDives(deltaTime: number, enemies: Enemy[]) {
        this.diveTimer += deltaTime;

        if (this.diveTimer < this.nextDiveTime) {
            return;
        }

        this.diveTimer = 0;
        this.nextDiveTime = this.getDiveInterval() * (0.7 + Math.random() * 0.6);

        const divers = enemies.filter(
            e => e.active && e.state === 'diving'
        ).length;

        if (divers >= this.getMaxDivers()) {
            return;
        }

        const candidates = enemies.filter(
            e => e.active && e.state === 'formation'
        );

        if (candidates.length === 0) {
            return;
        }

        candidates[Math.floor(Math.random() * candidates.length)].startDive();
    }

    // Horizontal offset shared by the whole formation
    getSwayX() {
        return Math.sin(this.swayTime * this.swaySpeed) * this.swayAmplitude;
    }

    private getDiveInterval() {
        return Math.max(3200 - (this.stage - 1) * 350, 900);
    }

    private getMaxDivers() {
        return Math.min(1 + Math.floor(this.stage / 2), 4);
    }

    private getWavesInStage() {
        return Math.min(2 + this.stage, 6);
    }

    getStage() {
        return this.stage;
    }

    getWave() {
        return this.wave;
    }

    getTotalWaves() {
        return this.getWavesInStage();
    }

    isStageComplete() {
        return this.stageComplete;
    }

    reset() {
        this.stage = 1;
        this.wave = 0;
        this.waveTimer = 0;
        this.stageComplete = false;
        this.stageTimer = 0;
        this.swayTime = 0;
        this.diveTimer = 0;
        this.nextDiveTime = this.getDiveInterval();
    }
}
