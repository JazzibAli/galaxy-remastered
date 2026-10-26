import { Enemy } from '../entities/Enemy';

export class WaveSystem {
    currentWave = 1;

    private waveStarted = false;
    private nextWaveTimer = 0;

    private readonly waveDelay = 2000;

    update(
        deltaTime: number,
        enemies: Enemy[],
        canvasWidth: number
    ) {
        if (!this.waveStarted) {
            this.startWave(enemies, canvasWidth);
            this.waveStarted = true;
            return;
        }

        if (enemies.length === 0) {
            this.nextWaveTimer += deltaTime;

            if (this.nextWaveTimer >= this.waveDelay) {
                this.currentWave++;
                this.nextWaveTimer = 0;

                this.startWave(
                    enemies,
                    canvasWidth
                );
            }
        } else {
            this.nextWaveTimer = 0;
        }
    }

    private startWave(
        enemies: Enemy[],
        canvasWidth: number
    ) {
        const rows = Math.min(
            2 + Math.floor(this.currentWave / 3),
            4
        );

        const enemiesPerRow = Math.min(
            5 + Math.floor(this.currentWave / 2),
            9
        );

        const horizontalSpacing =
            Math.min(
                80,
                (canvasWidth - 120) /
                enemiesPerRow
            );

        const totalWidth =
            (enemiesPerRow - 1) *
            horizontalSpacing;

        const startX =
            canvasWidth / 2 -
            totalWidth / 2;

        const startY = -60;

        for (let row = 0; row < rows; row++) {
            for (
                let column = 0;
                column < enemiesPerRow;
                column++
            ) {
                const x =
                    startX +
                    column *
                    horizontalSpacing;

                const y =
                    startY -
                    row * 55;

                enemies.push(
                    new Enemy(x, y)
                );
            }
        }
    }

    reset() {
        this.currentWave = 1;
        this.waveStarted = false;
        this.nextWaveTimer = 0;
    }

    getWaveNumber() {
        return this.currentWave;
    }
}
