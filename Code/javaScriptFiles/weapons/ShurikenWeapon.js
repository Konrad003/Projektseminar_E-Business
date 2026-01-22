import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

//ShurikenWeapon: Orbiting Sterne
export class ShurikenWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("shuriken");
        super(icon, description, level, name, { ...context, config });

        // Eigenes Array für Shuriken (nicht Grid!)
        this.shurikenProjectiles = [];

        // Erstelle Shuriken einmalig beim Spawnen
        if (this.shooter) {
            this.initializeShuriken();
        }
    }

    // Fix: Update-Loop nutzen, um Änderungen an Equipment (Extra Projectiles / Damage) zu erkennen
    render(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops, inputState = null) {
        // 1. Prüfen ob sich die Anzahl ändern muss (Extra Projectiles)
        const extra = this.shooter.extraProjectiles || 0;
        const baseAmount = this.projectileAmount || this.config.projectileConfig.amount || 3;
        const totalAmount = baseAmount + extra;

        if (this.shurikenProjectiles.length !== totalAmount) {
            this.initializeShuriken();
        }

        // 2. Damage dynamisch updaten (falls Damage-Item aufgenommen wurde)
        const effectiveDamage = this.dmg * (this.shooter.damageMultiplier || 1);
        for (let p of this.shurikenProjectiles) {
            p.dmg = effectiveDamage;
        }

        super.render(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops, inputState);
    }

    initializeShuriken() {
        this.shurikenProjectiles = []; // Reset array

        // Fix: Extra Projectiles einrechnen
        const extra = this.shooter.extraProjectiles || 0;
        const amount = (this.projectileAmount || this.config.projectileConfig.amount || 3) + extra;

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
