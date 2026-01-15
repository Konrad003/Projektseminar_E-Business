import {MovingEntity} from "./movingEntity.js";

export class Projectile extends MovingEntity {
    /**
     * Projektil-Klasse mit Unterstützung für drei Typen:
     * 1. NORMALE PLAYER-PROJEKTILE: Gespeichert in 3D-Grid [row][col][within], nutzen updateGridPlace()
     * 2. ENEMY-PROJEKTILE: Gespeichert in einfachem Array, für schnelle Bewegung ohne Grid-Tracking
     * 3. FIREBALL-PROJEKTILE: Einfaches Array, spezielles Explosion-Handling (Hit oder Timeout)
     */
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, piercing, size, direction, dmg, isEnemy = false, gridMapTile, creationTime, duration, orbiting = false, orbitProperties = null) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox);
        this.piercing = piercing;
        this.size = size;
        this.direction = direction;
        this.dmg = dmg;
        this.isEnemy = isEnemy; // true = Enemy-Projektil (einfaches Array), false = Player-Projektil (Grid)
        this.gridMapTile = gridMapTile // {row, col} oder {} für Fireballs/Enemy-Projektile
        this.creationTime = creationTime;
        this.duration = duration; // Lebenszeit in ms, nach der Explosion (nur Fireball relevant)
        this.orbiting = orbiting; // true für Shuriken und ähnliche orbitale Waffen
        this.orbitProperties = orbitProperties; // {radius, speed, shooter, angle}

        // Fireball-spezifische Eigenschaften
        this.exploded = false; // Flag für Explosions-Status
        this.explodedTime = 0; // Timestamp wenn Explosion ausgelöst wurde
        this.explosionDamageDealt = false; // Verhindert mehrfachen AoE-Schaden
    }

    handleProjectiles(ctx, projectiles, projectileIndex, enemies, player, map, gridWidth, enemyItemDrops, currentTime) {
        // Loop through projectiles for movement, drawing, and collision
        let killCount=0

        // FIREBALL SPEZIAL: Timeout-Check für Explosion nach Lebenszeit
        // Fireballs explodieren entweder bei Gegner-Hit ODER nach Duration
        if (this.isFireball) {
            const elapsedTime = currentTime - this.creationTime;
            const durationExpired = this.duration > 0 && elapsedTime > this.duration;
            if (durationExpired && !this.exploded) {
                this.exploded = true; // Triggert Explosion-Animation in render()
                this.explodedTime = currentTime;
            }
        }

        // Nur wenn nicht explodiert: normale Bewegung und Collision-Detection
        if (!this.exploded) {
            // 1. Move projectile
            this.move(map, projectiles, projectileIndex, gridWidth, player, currentTime);
            // 2. Draw projectile relative to the camera/player
            this.draw(ctx, player);
            // 3. Check collision with Player (nur für Enemy-Projektile)
            if (this.isEnemy) {
                // Feindliches Projektil trifft den Spieler
                if (this.checkCollision(player, 0, 0)) {
                    player.takeDmg(this.dmg);
                    // Feindliche Projektile sind i. d. R. nicht piercing:
                    projectiles.splice(projectileIndex, 1);
                }
            } else {
                // PLAYER-PROJEKTILE: Collision mit Gegnern
                for (let i = enemies.length - 1; i >= 0; i--) {
                    for (let n = enemies[i].length - 1; n >= 0; n--) {
                        for (let j = enemies[i][n].within.length - 1; j >= 0 ;j--) {
                            let enemy = enemies[i][n].within[j]
                            if (this.checkCollision(enemy, 0, 0)) {
                                // NORMALE PROJEKTILE: Direkter Schaden
                                if (!this.isFireball) {
                                    enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                                }
                                // NORMALE PROJEKTILE: Aus Grid löschen (wenn nicht piercing)
                                if (!this.piercing && !this.isFireball) {
                                    projectiles[this.gridMapTile.row][this.gridMapTile.column].within.splice(projectileIndex, 1)
                                } else if (this.isFireball) {
                                    // FIREBALL SPEZIAL: Explosion triggern statt direkten Schaden
                                    this.exploded = true;
                                    this.explodedTime = currentTime;
                                    // Schaden wird von FireballWeapon.damageEnemiesInRadius() angewendet
                                }
                                // Since the projectile is gone, break the inner loop and continue to the next projectile
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Timeout-Handling für normale Projektile (NICHT für Fireballs!)
        // Fireballs handhaben Timeout über exploded-Flag
        if (this.duration > 0 && currentTime - this.creationTime > this.duration) {
            if (this.isEnemy) projectiles.splice(projectileIndex);
            else if (!this.isFireball) projectiles[this.gridMapTile.row][this.gridMapTile.column].within.splice(projectileIndex, 1);
        }
    }


    move(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        // Orbitale Projektile (Shuriken): Bewegen sich im Kreis um Shooter
        if (this.orbiting) {
            const { radius, speed, shooter } = this.orbitProperties;
            const time = (currentTime - this.creationTime) / 1000; // in seconds
            this.globalEntityX = shooter.globalEntityX + radius * Math.cos(time * speed + this.orbitProperties.angle);
            this.globalEntityY = shooter.globalEntityY + radius * Math.sin(time * speed + this.orbitProperties.angle);
            return;
        }

        // Grid-Tracking nur für normale Player-Projektile
        // Enemy-Projektile und Fireballs nutzen einfaches Array und brauchen kein Grid-Update
        // Grund: Fireballs haben spezielle Explosion-Logik, Enemy-Projektile sind schnell und temporary
        let position
        if (!(this.isEnemy) && !this.isFireball) {
            position = this.updateGridPlace(map.tilelength, projectiles, projectileIndex, gridWidth)
        }

        // Standard-Bewegungslogik für alle Projektil-Typen
        let oldGlobalEntityX = this.globalEntityX
        let oldGlobalEntityY = this.globalEntityY
        if (this.direction.x > 0) {
            this.globalEntityX = map.rightFree(this.globalEntityX, this.globalEntityY, (this.direction.x * this.speed), this.hitbox)
        } else {
            this.globalEntityX = map.leftFree(this.globalEntityX, this.globalEntityY, (this.direction.x * this.speed) * -1, this.hitbox)
        }

        if (this.direction.y < 0) {
            this.globalEntityY = map.topFree(this.globalEntityX, this.globalEntityY, (this.direction.y * this.speed) * -1, this.hitbox)
        } else {
            this.globalEntityY = map.downFree(this.globalEntityX, this.globalEntityY, (this.direction.y * this.speed), this.hitbox)
        }

        // Wandkollisions-Handling: Unterschiedlich je nach Speichertyp
        if ((oldGlobalEntityX === this.globalEntityX && this.direction.x !== 0) || (oldGlobalEntityY === this.globalEntityY && this.direction.y !== 0)) {
            // Enemy und Fireball-Projektile (einfaches Array): direkt löschen
            if (this.isEnemy || this.isFireball) {
                projectiles.splice(projectileIndex)
            } else {
                // Normale Player-Projektile (Grid): aus Grid entfernen
                projectiles[position.gridMapTile.row][position.gridMapTile.column].within.splice(position.positionWithin, 1);
            }
        }
    }

    render(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne, gridWidth, enemyItemDrops, currentTime){
        this.handleProjectiles(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne, gridWidth, enemyItemDrops, currentTime);

        // Fireball-Explosion Animation (nach Collision oder Timeout)
        if (this.isFireball && this.exploded) {
            const explosionElapsed = currentTime - this.explodedTime;
            if (explosionElapsed < 300) {
                this.drawExplosionCircle(ctx, PlayerOne, explosionElapsed);
            }
        }
    }

    drawExplosionCircle(ctx, PlayerOne, elapsed) {
        const screenX = this.globalEntityX - PlayerOne.globalEntityX + PlayerOne.canvasWidthMiddle;
        const screenY = this.globalEntityY - PlayerOne.globalEntityY + PlayerOne.canvasWidthHeight;
        const opacity = 1 - (elapsed / 300);
        const explosionRadius = 100; // Fireball explosion radius
        ctx.fillStyle = `rgba(255, 50, 0, ${0.7 * opacity})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, explosionRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    getColor() {
        if (this.isFireball) {
            return this.fireballColor || 'rgba(255, 50, 0, 0.9)'; // Fireball ist rot-orange
        }
        return this.isEnemy ? 'orange' :'cyan'
    }
}