import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "../weapon-config.js";
import { Projectile } from "../projectiles/index.js";

/**
 * ThunderstrikeWeapon: Blitz-Attacke
 * WARUM SPECIAL: Keine Projektile, nur Damage-Effekt + Custom shoot()
 */
export class ThunderstrikeWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth, level = 1) {
        const config = getWeaponConfig("thunderstrike");
        super(config, shooter, mapWidth, mapHeight, gridWidth, level);
        this.lastLightningTime = 0;
        this.lastLightningDirections = [];
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        if (currentTime - this.lastShotTime < this.cooldown) return;
        this.lastShotTime = currentTime;

        this.lastLightningDirections = [];
        const lightningCount = 2; // Nur 2 Blitze

        // Erzeugen Blitze in ZUFÄLLIGE Richtungen (nutzt Projectile-Methode)
        for (let i = 0; i < lightningCount; i++) {
            const lightningDir = Projectile.getRandomDirection();
            const lightningAngle = Math.atan2(lightningDir.y, lightningDir.x);

            this.lastLightningDirections.push(lightningDir);
            this.damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops);
        }

        this.lastLightningTime = currentTime;
    }

    damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops) {
        const lightningLength = this.config.projectileConfig.lightningLength;

        this.forEachEnemy(enemies, (enemy, enemies, j) => {
            const dx = enemy.globalEntityX - this.shooter.globalEntityX;
            const dy = enemy.globalEntityY - this.shooter.globalEntityY;
            const distToEnemy = Math.hypot(dx, dy);

            if (distToEnemy <= lightningLength) {
                const angleToEnemy = Math.atan2(dy, dx);
                const angleDiff = Math.abs(angleToEnemy - lightningAngle);
                if (angleDiff < Math.PI / 12 || Math.abs(angleDiff - Math.PI * 2) < Math.PI / 12) {
                    enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                }
            }
        });
    }

    renderEffects(ctx, playerOne, performanceNow) {
        const timeSinceLightning = performanceNow - this.lastLightningTime;
        const lightningDuration = this.config.projectileConfig.lightningDuration;

        if (timeSinceLightning < lightningDuration && this.lastLightningDirections.length > 0) {
            for (let dir of this.lastLightningDirections) {
                this.drawLightning(ctx, playerOne, dir);
            }
        }
    }

    drawLightning(ctx, playerOne, direction) {
        const lightningLength = this.config.projectileConfig.lightningLength;
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
