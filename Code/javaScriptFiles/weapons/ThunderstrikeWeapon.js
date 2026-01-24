import { Weapon } from "./Weapon.js";
import { Projectile } from "../projectiles/Projectile.js";

/**
 * ThunderstrikeWeapon: Blitz-Attacke
 * WARUM SPECIAL: Keine Projektile, nur Damage-Effekt + Custom shoot()
 */
export class ThunderstrikeWeapon extends Weapon {
    constructor(icon, description, level, name, shooter, mapWidth, mapHeight, gridWidth ,dmg ,cooldown ,range ,piercing ,maxLevel, startLevel, isSpecial, projectile, projectileConfig) {
        super(icon, description, level, name, shooter, mapWidth, mapHeight, gridWidth ,dmg ,cooldown ,range ,piercing ,maxLevel, startLevel, isSpecial, projectile, projectileConfig);
        this.lastLightningTime = 0;
        this.lastLightningDirections = [];
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        // Fix: Cooldown Multiplier anwenden
        const effectiveCooldown = this.cooldown * (player.cooldownMultiplier || 1);

        if (currentTime - this.lastShotTime < effectiveCooldown) return;
        this.lastShotTime = currentTime;

        this.lastLightningDirections = [];

        // Fix: Extra Projectiles anwenden (Mehr Blitze)
        const extra = player.extraProjectiles || 0;
        const lightningCount = (this.projectileConfig.lightningCount || 2) + extra;

        // Fix: Damage Multiplier anwenden
        const effectiveDamage = this.dmg * (player.damageMultiplier || 1);

        // Erzeugen Blitze in ZUFÄLLIGE Richtungen (nutzt Projectile-Methode)
        for (let i = 0; i < lightningCount; i++) {
            const lightningDir = Projectile.getRandomDirection();
            const lightningAngle = Math.atan2(lightningDir.y, lightningDir.x);

            this.lastLightningDirections.push(lightningDir);
            this.damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops, effectiveDamage);
        }

        this.lastLightningTime = currentTime;
    }

    damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops, damage) {
        const lightningLength = this.projectileConfig.lightningLength;

        this.forEachEnemy(enemies, (enemy, enemies, j) => {
            const dx = enemy.globalEntityX - this.shooter.globalEntityX;
            const dy = enemy.globalEntityY - this.shooter.globalEntityY;
            const distToEnemy = Math.hypot(dx, dy);

            if (distToEnemy <= lightningLength) {
                const angleToEnemy = Math.atan2(dy, dx);
                const angleDiff = Math.abs(angleToEnemy - lightningAngle);
                if (angleDiff < Math.PI / 12 || Math.abs(angleDiff - Math.PI * 2) < Math.PI / 12) {
                    enemy.takeDmg(damage, enemies, j, enemyItemDrops);
                }
            }
        });
    }
       updateStats() {
        if (this.level === this._currentStatsLevel) return;
        this.dmg += 3
        this.cooldown -= 30;           // +15 Schaden pro Level
        this.piercing += 0,     // +1 Piercing alle 2 Level
        this.range += 30,         // +50 Range pro Level
        this.projectileConfig.projectileAmount += 0;   // Keine Extra-Projektile
        this.projectileConfig.lightningLength += 30;
        this.projectileConfig.lightningCount += 0.5;
    }

    renderEffects(ctx, playerOne, performanceNow) {
        const timeSinceLightning = performanceNow - this.lastLightningTime;
        const lightningDuration = this.projectileConfig.lightningDuration;

        if (timeSinceLightning < lightningDuration && this.lastLightningDirections.length > 0) {
            for (let dir of this.lastLightningDirections) {
                this.drawLightning(ctx, playerOne, dir);
            }
        }
    }

    drawLightning(ctx, playerOne, direction) {
        const lightningLength = this.projectileConfig.lightningLength;
        const screenX = this.shooter.globalEntityX - playerOne.globalEntityX + playerOne.canvasWidthMiddle;
        const screenY = this.shooter.globalEntityY - playerOne.globalEntityY + playerOne.canvasWidthHeight;
        const endX = screenX + direction.x * lightningLength;
        const endY = screenY + direction.y * lightningLength;

        ctx.save();
        ctx.strokeStyle = '#0033FF';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.strokeStyle = '#6699FF';
        ctx.lineWidth = 12;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }

    createProjectiles() {
        // Blitze werden in shoot() erstellt
    }
}
