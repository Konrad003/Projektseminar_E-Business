import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * AxeWeapon: Boomerang-Axt
 * WARUM SPECIAL: Boomerangs brauchen Array-Speicherung (nicht Grid) wegen Rückkehr-Logik
 */
export class AxeWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("axe");
        super(icon, description, level, name, { ...context, config });

        // Eigenes Array für Boomerangs (nicht Grid!)
        this.boomerangProjectiles = [];
    }

    createProjectiles(target, direction, currentTime, tilelength, gridWidth, player) {
        const BoomerangProjectile = this.config.projectile;

        // Erweiterte Config mit shooter für Rückkehr
        const extendedConfig = {
            ...this.config.projectileConfig,
            shooter: this.shooter
        };

        // Fix: Damage Multiplier anwenden
        const effectiveDamage = this.dmg * (this.shooter.damageMultiplier || 1);

        const projectile = new BoomerangProjectile(
            this.shooter.globalEntityX,
            this.shooter.globalEntityY,
            direction,
            effectiveDamage,
            extendedConfig,
            {},  // Kein Grid
            currentTime,
            false  // isEnemy
        );

        this.boomerangProjectiles.push(projectile);
    }

    renderProjectiles(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops) {
        // Boomerangs verwenden eigenes Array, nicht Grid
        this._renderArray(this.boomerangProjectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops);
    }
}
