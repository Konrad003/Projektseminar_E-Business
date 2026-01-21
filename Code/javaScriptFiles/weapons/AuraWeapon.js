import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * AuraWeapon: Passive defensive Aura
 * WARUM SPECIAL: Keine Projektile, nur Damage-Loop
 */
export class AuraWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth, level = 1) {
        const config = getWeaponConfig("aura");
        super(config, shooter, mapWidth, mapHeight, gridWidth, level);
        this.lastAuraDmgTime = 0;
        this.projectiles = [];
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        // Aura hat keine Cooldown, tickt immer
        this.damageEnemies(enemies, currentTime, enemyItemDrops);
    }

    createProjectiles() {
        // Aura erstellt keine Projektile
    }

    damageEnemies(enemies, currentTime, enemyItemDrops) {
        const auraDmgInterval = this.config.projectileConfig.auraDmgInterval;
        if (currentTime - this.lastAuraDmgTime < auraDmgInterval) return;
        this.lastAuraDmgTime = currentTime;

        const auraRadius = this.config.projectileConfig.auraRadius;

        this.forEachEnemy(enemies, (enemy, enemies, j) => {
            const dx = enemy.globalEntityX - this.shooter.globalEntityX;
            const dy = enemy.globalEntityY - this.shooter.globalEntityY;
            if (Math.hypot(dx, dy) < auraRadius) {
                enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
            }
        });
    }

    renderEffects(ctx, playerOne, performanceNow) {
        const screenX = this.shooter.globalEntityX - playerOne.globalEntityX + playerOne.canvasWidthMiddle;
        const screenY = this.shooter.globalEntityY - playerOne.globalEntityY + playerOne.canvasWidthHeight;
        const auraRadius = this.config.projectileConfig.auraRadius;
        const auraColor = this.config.projectileConfig.auraColor;

        ctx.save();
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(screenX, screenY, auraRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
