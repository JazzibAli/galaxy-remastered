export class ComboSystem {
    private kills = 0;
    private timeLeft = 0;

    // Milliseconds the player has to land the next kill
    private readonly comboWindow = 3000;

    // Kills needed per multiplier level, and the cap
    private readonly killsPerLevel = 4;
    private readonly maxMultiplier = 5;

    // Call when an enemy is destroyed. Returns the multiplier to apply
    // to that kill's points, then extends the streak.
    registerKill(): number {
        const multiplier = this.getMultiplier();

        this.kills++;
        this.timeLeft = this.comboWindow;

        return multiplier;
    }

    update(deltaTime: number) {
        if (this.kills === 0) {
            return;
        }

        this.timeLeft -= deltaTime;

        if (this.timeLeft <= 0) {
            this.breakCombo();
        }
    }

    // Called when the player is hit, or when the timer runs out
    breakCombo() {
        this.kills = 0;
        this.timeLeft = 0;
    }

    reset() {
        this.breakCombo();
    }

    // Multiplier the next kill will receive: x1 to x5
    getMultiplier(): number {
        return Math.min(
            1 + Math.floor(this.kills / this.killsPerLevel),
            this.maxMultiplier
        );
    }

    getKills() {
        return this.kills;
    }

    // 1 right after a kill, draining to 0 when the combo expires
    getTimeFraction(): number {
        return Math.max(0, this.timeLeft / this.comboWindow);
    }

    isActive() {
        return this.kills > 0;
    }
}
