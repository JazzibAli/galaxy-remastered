import { Enemy } from '../entities/Enemy';

export class SpawnSystem {
    private stage = 1;
    private wave = 0; // waves started in the current stage
    private waveTimer = 0;
    private readonly waveDelay = 1500;

    private stageComplete = false;
    private stageTimer = 0;
    private readonly stageDelay = 2500;

    update(
        deltaTime: number,
        enemies: Enemy[],
        canvasWidth: number
    ) {
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

        // Wait until the current wave is cleared
        if (enemies.length > 0) {
            this.waveTimer = 0;
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
        const startY = -60;

        const speed = Math.min(1.5 + (this.stage - 1) * 0.25, 4);

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < enemiesPerRow; column++) {
                const enemy = new Enemy(
                    startX + column * horizontalSpacing,
                    startY - row * 55
                );
                enemy.speed = speed;
                enemies.push(enemy);
            }
        }
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
    }
}

/*export class SpawnSystem {
    private stage = 1;
    private spawnTimer = 0;
    private spawnedInStage = 0;

    private stageComplete = false;
    private stageTimer = 0;
    private readonly stageDelay = 2500;

    update(
        deltaTime: number,
        enemies: Enemy[],
        canvasWidth: number
    ) {
        // Short pause between stages
        if (this.stageComplete) {
            this.stageTimer += deltaTime;

            if (this.stageTimer >= this.stageDelay) {
                this.stage++;
                this.spawnedInStage = 0;
                this.spawnTimer = 0;
                this.stageTimer = 0;
                this.stageComplete = false;
            }
            return;
        }

        // All enemies spawned: wait until the screen is clear
        if (this.spawnedInStage >= this.getEnemiesInStage()) {
            if (enemies.length === 0) {
                this.stageComplete = true;
                this.stageTimer = 0;
            }
            return;
        }

        this.spawnTimer += deltaTime;

        if (this.spawnTimer < this.getSpawnInterval()) {
            return;
        }

        this.spawnTimer = 0;
        this.spawnEnemy(enemies, canvasWidth);
        this.spawnedInStage++;
    }

    private spawnEnemy(
        enemies: Enemy[],
        canvasWidth: number
    ) {
        const margin = 60;

        const x =
            margin +
            Math.random() *
            (canvasWidth - margin * 2);

        const enemy = new Enemy(x, -50);

        enemy.speed = Math.min(2 + (this.stage - 1) * 0.3, 5);

        enemies.push(enemy);
    }

    private getEnemiesInStage() {
        return 10 + (this.stage - 1) * 5;
    }

    private getSpawnInterval() {
        return Math.max(1500 - (this.stage - 1) * 150, 500);
    }

    getStage() {
        return this.stage;
    }

    isStageComplete() {
        return this.stageComplete;
    }

    reset() {
        this.stage = 1;
        this.spawnTimer = 0;
        this.spawnedInStage = 0;
        this.stageComplete = false;
        this.stageTimer = 0;
    }
}
*/