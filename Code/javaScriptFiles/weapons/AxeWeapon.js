import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "../weapon-config.js";

/**
 * AxeWeapon: Boomerang-Axt
 * WARUM SPECIAL: Boomerangs brauchen Array-Speicherung (nicht Grid) wegen Rückkehr-Logik
 */
export class AxeWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth, level = 1) {
        const config = getWeaponConfig("axe");
        super(config, shooter, mapWidth, mapHeight, gridWidth, level);

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

        const projectile = new BoomerangProjectile(
            this.shooter.globalEntityX,
            this.shooter.globalEntityY,
            direction,
            this.dmg,
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
