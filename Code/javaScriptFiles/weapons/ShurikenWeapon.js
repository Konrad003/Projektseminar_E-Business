import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

//ShurikenWeapon: Orbiting Sterne
export class ShurikenWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth, level = 1) {
        const config = getWeaponConfig("shuriken");
        super(config, shooter, mapWidth, mapHeight, gridWidth, level);

        // Eigenes Array für Shuriken (nicht Grid!)
        this.shurikenProjectiles = [];

        // Erstelle Shuriken einmalig beim Spawnen
        this.initializeShuriken();
    }

    initializeShuriken() {
        // Nutze projectileAmount vom Level-System
        const amount = this.projectileAmount || this.config.projectileConfig.amount || 3;

        console.log(`ShurikenWeapon: Erstelle ${amount} Shuriken (Level ${this.level})`);

        for (let i = 0; i < amount; i++) {
            const angle = (2 * Math.PI / amount) * i;
            const OrbitingProjectile = this.config.projectile;

            // Wichtig: config.shooter setzen für Orbit-Berechnung
            const projectileConfig = {
                ...this.config.projectileConfig,
                shooter: this.shooter
            };

            const projectile = new OrbitingProjectile(
                this.shooter.globalEntityX,
                this.shooter.globalEntityY,
                { x: 1, y: 0 },
                this.dmg,
                projectileConfig,
                {},
                performance.now(),
                angle
            );
            this.shurikenProjectiles.push(projectile);
        }
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        // Shuriken: Passiv - keine Schusslogik nötig
        // Die Projektile orbiten bereits automatisch
    }

    createProjectiles(target, direction, currentTime, tilelength, gridWidth, player) {
        // Shuriken erstellen sich selbst im Constructor
    }

    renderProjectiles(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops) {
        // Shuriken verwenden eigenes Array, nicht Grid
        this._renderArray(this.shurikenProjectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops);
    }
}
