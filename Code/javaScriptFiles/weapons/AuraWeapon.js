import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * AuraWeapon: Passive defensive Aura
 * WARUM SPECIAL: Keine Projektile, nur Damage-Loop
 */
export class AuraWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("aura");
        super(icon, description, level, name, { ...context, config });
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
        // Fix: Cooldown Multiplier auf Intervall anwenden (schnellerer Tick)
        let auraDmgInterval = this.config.projectileConfig.auraDmgInterval;
        if (this.shooter.cooldownMultiplier) {
            auraDmgInterval *= this.shooter.cooldownMultiplier;
        }

        if (currentTime - this.lastAuraDmgTime < auraDmgInterval) return;
        this.lastAuraDmgTime = currentTime;

        const auraRadius = this.config.projectileConfig.auraRadius;

        // Fix: Damage Multiplier anwenden
        const effectiveDamage = this.dmg * (this.shooter.damageMultiplier || 1);

        this.forEachEnemy(enemies, (enemy, enemies, j) => {
            const dx = enemy.globalEntityX - this.shooter.globalEntityX;
            const dy = enemy.globalEntityY - this.shooter.globalEntityY;
            if (Math.hypot(dx, dy) < auraRadius) {
                enemy.takeDmg(effectiveDamage, enemies, j, enemyItemDrops);
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
