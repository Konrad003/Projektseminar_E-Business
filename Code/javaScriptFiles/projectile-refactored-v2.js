import { MovingEntity } from "./movingEntity.js";

/**
 * ============ REFACTORED PROJECTILE SYSTEM ============
 * CONFIG-DRIVEN: Alle Daten aus WeaponConfig, nicht als Constructor-Parameter
 *
 * NEU: Constructor(globalX, globalY, direction, dmg, config, gridMapTile, creationTime, isEnemy)
 * - config enthält: speed, size, duration, explosionRadius, etc.
 * - Projectile entscheidet selbst seine Speicherung (Grid vs Array)
 * - Keine 13 Parameter mehr!
 */

export class Projectile extends MovingEntity {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, isEnemy = false) {
        super(globalEntityX, globalEntityY, 1, null, config.speed || 6, { width: config.size || 6, height: config.size || 6 });

        this.direction = direction;
        this.dmg = dmg;
        this.config = config;
        this.gridMapTile = gridMapTile;
        this.creationTime = creationTime;
        this.isAlive = true;
        this.isEnemy = isEnemy;

        // Aus Config extrahiert
        this.size = config.size || 6;
        this.piercing = config.piercing || 0;
    }

    /**
     * Template-Method: Wird von Waffe aufgerufen
     */
    handleProjectile(ctx, projectiles, projectileIndex, enemies, player, map, gridWidth, enemyItemDrops, currentTime) {
        // 1. Update Position und State
        this.update(map, projectiles, projectileIndex, gridWidth, player, currentTime);

        // 2. Draw if still alive
        if (this.isAlive) {
            this.draw(ctx, player);
        }

        // 3. Collision Detection
        if (this.isAlive) {
            this.checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime);
        }

        // 4. Cleanup if dead
        if (!this.isAlive) {
            this.cleanup(projectiles, projectileIndex);
        }
    }

    /**
     * Update Position und State - Überschreiben in Subklassen
     */
    update(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        this.move(map, projectiles, projectileIndex, gridWidth, currentTime);
    }

    /**
     * Standard-Bewegungslogik
     */
    move(map, projectiles, projectileIndex, gridWidth, currentTime) {
        let oldGlobalEntityX = this.globalEntityX;
        let oldGlobalEntityY = this.globalEntityY;

        // Standard-Bewegung in Richtung
        if (this.direction.x > 0) {
            this.globalEntityX = map.rightFree(this.globalEntityX, this.globalEntityY, this.direction.x * this.speed, this.hitbox);
        } else if (this.direction.x < 0) {
            this.globalEntityX = map.leftFree(this.globalEntityX, this.globalEntityY, Math.abs(this.direction.x * this.speed), this.hitbox);
        }

        if (this.direction.y < 0) {
            this.globalEntityY = map.topFree(this.globalEntityX, this.globalEntityY, Math.abs(this.direction.y * this.speed), this.hitbox);
        } else if (this.direction.y > 0) {
            this.globalEntityY = map.downFree(this.globalEntityX, this.globalEntityY, this.direction.y * this.speed, this.hitbox);
        }

        // Wandkollisions-Handling
        if ((oldGlobalEntityX === this.globalEntityX && this.direction.x !== 0) ||
            (oldGlobalEntityY === this.globalEntityY && this.direction.y !== 0)) {
            this.onWallCollision();
        }

        // Hinweis: Projektile verwalten sich selbst nicht im Grid
        // Das wird von der Waffe über addTo/removeFrom Methoden gehandhabt
    }

    onWallCollision() {
        this.isAlive = false;
    }

    /**
     * Draw Projektil
     */
    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;

        ctx.save();
        const color = this.getColor();
        ctx.fillStyle = color;
        ctx.fillRect(screenX - this.size / 2, screenY - this.size / 2, this.size, this.size);
        ctx.restore();
    }

    /**
     * Collision Detection
     */
    checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime) {
        if (this.isEnemy) {
            // Enemy-Projektil trifft Spieler
            if (this.checkCollisionWith(player)) {
                player.takeDmg(this.dmg, [], null, enemyItemDrops);
                this.isAlive = false;
            }
        } else {
            // Player-Projektil trifft Gegner
            this.checkCollisionWithEnemies(enemies, enemyItemDrops);
        }
    }

    /**
     * Prüfe Collision mit einzelnem Entity
     */
    checkCollisionWith(entity) {
        const dx = entity.globalEntityX - this.globalEntityX;
        const dy = entity.globalEntityY - this.globalEntityY;
        return Math.abs(dx) < this.hitbox.width / 2 + entity.hitbox.width / 2 &&
               Math.abs(dy) < this.hitbox.height / 2 + entity.hitbox.height / 2;
    }

    /**
     * Prüfe Collision mit allen Gegnern
     */
    checkCollisionWithEnemies(enemies, enemyItemDrops) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    let enemy = enemies[i][n].within[j];
                    if (this.checkCollisionWith(enemy)) {
                        enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                        if (!this.piercing) {
                            this.isAlive = false;
                        }
                        break;
                    }
                }
            }
        }
    }

    /**
     * Cleanup - Entfernen aus Grid oder Array
     */
    cleanup(projectiles, projectileIndex) {
        this.removeFrom(projectiles, projectileIndex);
    }

    /**
     * SELBSTBESTIMMTE SPEICHERUNG
     * Das Projectile entscheidet selbst, wie es gespeichert wird.
     */
    addTo(weaponProjectiles) {
        // Standard: Player-Projectil mit Grid-Speicherung
        if (this.isEnemy) {
            // Enemy-Projectil: einfaches Array
            weaponProjectiles.push(this);
        } else if (Object.keys(this.gridMapTile).length > 0) {
            // Grid-basiert (Standard für Player-Projektile)
            const { row, column } = this.gridMapTile;
            if (!Array.isArray(weaponProjectiles[row]?.[column]?.within)) {
                weaponProjectiles[row][column].within = [];
            }
            weaponProjectiles[row][column].within.push(this);
        } else {
            // Fallback: einfaches Array (Orbits, Specials)
            weaponProjectiles.push(this);
        }
    }

    /**
     * Entfernt sich selbst aus Speicherung
     */
    removeFrom(weaponProjectiles, index) {
        if (this.isEnemy || !Object.keys(this.gridMapTile).length) {
            // Array-basiert
            weaponProjectiles.splice(index, 1);
        } else {
            // Grid-basiert
            const { row, column } = this.gridMapTile;
            if (weaponProjectiles[row]?.[column]?.within) {
                weaponProjectiles[row][column].within.splice(index, 1);
            }
        }
    }

    getColor() {
        return this.isEnemy ? 'orange' : 'cyan';
    }
}

// ============ SPEZIALISIERTE PROJEKTIL-KLASSEN ============

/**
 * BasicProjectile: Pfeil, Speer, Messer - einfache Bewegung
 */
export class BasicProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.duration = config.duration || -1;
    }

    update(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        // Timeout-Handling
        if (this.duration > 0 && currentTime - this.creationTime > this.duration) {
            this.isAlive = false;
            return;
        }
        super.update(map, projectiles, projectileIndex, gridWidth, player, currentTime);
    }
}

/**
 * FireballProjectile: Fliegt → Explosion bei Timeout oder Collision
 */
export class FireballProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.duration = config.duration || 2000; // 2 Sekunden Flugzeit
        this.exploded = false;
        this.explodedTime = 0;
        this.explosionRadius = config.explosionRadius || 100;
        this.explosionColor = config.explosionColor || 'rgba(255, 50, 0, 0.9)';
        this.explosionDuration = 300;
        this.explosionDamageDealt = false;
    }

    update(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        // Timeout → Explosion
        if (!this.exploded && this.duration > 0 && currentTime - this.creationTime > this.duration) {
            this.triggerExplosion(currentTime);
            return;
        }

        // Normale Bewegung
        if (!this.exploded) {
            super.update(map, projectiles, projectileIndex, gridWidth, player, currentTime);
        }
    }

    triggerExplosion(currentTime) {
        this.exploded = true;
        this.explodedTime = currentTime;
    }

    checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime) {
        if (this.exploded) {
            // Explosion-Schaden in Radius
            if (!this.explosionDamageDealt) {
                this.applyExplosionDamage(enemies, enemyItemDrops);
                this.explosionDamageDealt = true;
            }

            // Explosion abgelaufen → löschen
            if (currentTime - this.explodedTime > this.explosionDuration) {
                this.isAlive = false;
            }
        } else {
            // Vor Explosion: Check ob Gegner getroffen
            for (let i = enemies.length - 1; i >= 0; i--) {
                for (let n = enemies[i].length - 1; n >= 0; n--) {
                    for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                        let enemy = enemies[i][n].within[j];
                        if (this.checkCollisionWith(enemy)) {
                            // Bei Treffer: Explosion auslösen statt Gegner direkt zu schaden
                            this.triggerExplosion(currentTime);
                            return; // Explosion wird im nächsten Frame Schaden machen
                        }
                    }
                }
            }
        }
    }

    applyExplosionDamage(enemies, enemyItemDrops) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    let enemy = enemies[i][n].within[j];
                    const dx = enemy.globalEntityX - this.globalEntityX;
                    const dy = enemy.globalEntityY - this.globalEntityY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.explosionRadius) {
                        enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                    }
                }
            }
        }
    }

    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;

        ctx.save();

        if (this.exploded) {
            // Explosion-Animation
            const elapsed = performance.now() - this.explodedTime;
            const opacity = Math.max(0, 1 - (elapsed / this.explosionDuration));
            const currentRadius = this.explosionRadius * (1 + elapsed / this.explosionDuration * 0.5);

            ctx.fillStyle = `rgba(255, 50, 0, ${0.7 * opacity})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Normale Fireball-Darstellung
            ctx.fillStyle = this.explosionColor;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

/**
 * MolotovProjectile: Bogen-Flug → Landung → Kreis mit DoT
 */
export class MolotovProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.flightDuration = config.flightDuration || 1000;
        this.startX = globalEntityX;
        this.startY = globalEntityY;
        this.landed = false;
        this.landedTime = 0;
        this.circleVisibleDuration = 4000;
        this.dotRadius = config.dotRadius || 100;
        this.dotDmg = config.dotDmg || 25;
        this.lastDotTime = 0;
        this.dotInterval = config.dotInterval || 500;

        // Zufällige Richtung für Molotov
        const randomAngle = Math.random() * Math.PI * 2;
        this.direction = {
            x: Math.cos(randomAngle),
            y: Math.sin(randomAngle)
        };
    }

    move(map, projectiles, projectileIndex, gridWidth, currentTime) {
        if (this.landed) {
            return;
        }

        // Bogen-Flug
        const elapsedTime = currentTime - this.creationTime;
        const progress = Math.min(elapsedTime / this.flightDuration, 1);

        if (progress < 1) {
            // Parabel-Bewegung - Zielrichtung basiert auf direction
            const flightDistance = this.config.speed; // Gesamte Flugdistanz
            const arcHeight = 150 * Math.sin(progress * Math.PI); // Bogen-Höhe

            this.globalEntityX = this.startX + this.direction.x * flightDistance * progress;
            this.globalEntityY = this.startY + this.direction.y * flightDistance * progress - arcHeight;
        } else {
            // Landung
            if (!this.landed) {
                this.landed = true;
                this.landedTime = currentTime;
            }
        }
    }

    update(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        this.move(map, projectiles, projectileIndex, gridWidth, currentTime);

        // Nach 4 Sekunden: verschwinden
        if (this.landed && currentTime - this.landedTime > this.circleVisibleDuration) {
            this.isAlive = false;
        }
    }

    checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime) {
        if (!this.landed) return;

        // DoT-Schaden alle 0.5 Sekunden
        if (currentTime - this.lastDotTime >= this.dotInterval) {
            this.lastDotTime = currentTime;
            this.applyDotDamage(enemies, enemyItemDrops);
        }
    }

    applyDotDamage(enemies, enemyItemDrops) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    let enemy = enemies[i][n].within[j];
                    const dx = enemy.globalEntityX - this.globalEntityX;
                    const dy = enemy.globalEntityY - this.globalEntityY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.dotRadius) {
                        enemy.takeDmg(this.dotDmg, enemies, j, enemyItemDrops);
                    }
                }
            }
        }
    }

    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;

        ctx.save();

        if (this.landed) {
            // Grüner Kreis nach Landung
            ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Grünes Quadrat während Flug
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(screenX - 6, screenY - 6, 12, 12);
        }

        ctx.restore();
    }
}

/**
 * SlashProjectile: Schwert-Schlag
 */
export class SlashProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, startAngle = 0, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.startAngle = startAngle;
        this.endAngle = startAngle + (config.arcAngle || Math.PI * 0.5);
        this.duration = config.duration || 200;
        this.radius = config.radius || 100;
        this.minCutRadius = config.minCutRadius || 80;
        this.enemiesHit = new Set();
    }

    update(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        // Slash dauert nur kurz
        const elapsedTime = currentTime - this.creationTime;
        if (elapsedTime > this.duration) {
            this.isAlive = false;
        }
    }

    checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime) {
        // Slash trifft Gegner im Arc-Bereich
        const elapsedTime = currentTime - this.creationTime;
        const progress = elapsedTime / this.duration;
        const currentAngle = this.startAngle + (this.endAngle - this.startAngle) * progress;

        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    const enemy = enemies[i][n].within[j];
                    if (this.enemiesHit.has(enemy)) continue;

                    const dx = enemy.globalEntityX - this.globalEntityX;
                    const dy = enemy.globalEntityY - this.globalEntityY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angleToEnemy = Math.atan2(dy, dx);

                    // Prüfe ob im Radius und im Arc
                    if (dist > this.minCutRadius && dist < this.radius) {
                        const angleDiff = Math.abs(angleToEnemy - currentAngle);
                        const arcSpread = Math.PI / 6;

                        if (angleDiff < arcSpread || Math.abs(angleDiff - Math.PI * 2) < arcSpread) {
                            enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                            this.enemiesHit.add(enemy);
                        }
                    }
                }
            }
        }
    }

    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;
        const elapsedTime = performance.now() - this.creationTime;
        const progress = Math.min(elapsedTime / this.duration, 1);
        const currentAngle = this.startAngle + (this.endAngle - this.startAngle) * progress;

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        ctx.beginPath();
        const startX = screenX + Math.cos(this.startAngle) * this.minCutRadius;
        const startY = screenY + Math.sin(this.startAngle) * this.minCutRadius;
        ctx.moveTo(startX, startY);

        const endX = screenX + Math.cos(currentAngle) * this.radius;
        const endY = screenY + Math.sin(currentAngle) * this.radius;
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.restore();
    }
}

/**
 * OrbitingProjectile: Shurikens orbiting um Schütze
 */
export class OrbitingProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, angle = 0, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.angle = angle;
        this.orbitRadius = config.orbitRadius || 100;
        this.orbitSpeed = config.orbitSpeed || 2;
    }

    move(map, projectiles, projectileIndex, gridWidth, currentTime) {
        if (this.config.shooter) {
            // Rotiere um Schütze
            this.angle += this.orbitSpeed * 0.016; // 0.016s = ~60fps
            this.globalEntityX = this.config.shooter.globalEntityX + Math.cos(this.angle) * this.orbitRadius;
            this.globalEntityY = this.config.shooter.globalEntityY + Math.sin(this.angle) * this.orbitRadius;
        }
    }

    checkCollision(enemies, player, projectiles, projectileIndex, enemyItemDrops, currentTime) {
        // Orbiting Projectiles checken Collision
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    let enemy = enemies[i][n].within[j];
                    if (this.checkCollisionWith(enemy)) {
                        enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                        if (!this.piercing) {
                            this.isAlive = false;
                        }
                        break;
                    }
                }
            }
        }
    }

    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;

        ctx.save();
        ctx.fillStyle = 'rgba(200, 100, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * BoomerangProjectile: Axt fliegt hin und zurück
 */
export class BoomerangProjectile extends Projectile {
    constructor(globalEntityX, globalEntityY, direction, dmg, config = {}, gridMapTile = {}, creationTime, isEnemy = false) {
        super(globalEntityX, globalEntityY, direction, dmg, config, gridMapTile, creationTime, isEnemy);
        this.startX = globalEntityX;
        this.startY = globalEntityY;
        this.maxRange = config.maxRange || 400;
        this.returning = false;
        this.distanceTraveled = 0;
        // Kein Grid für Boomerangs
        this.gridMapTile = {};
    }

    move(map, projectiles, projectileIndex, gridWidth, currentTime) {
        if (!this.returning) {
            // Flieg weg
            const oldX = this.globalEntityX;
            const oldY = this.globalEntityY;

            if (this.direction.x > 0) {
                this.globalEntityX = map.rightFree(this.globalEntityX, this.globalEntityY, this.direction.x * this.speed, this.hitbox);
            } else if (this.direction.x < 0) {
                this.globalEntityX = map.leftFree(this.globalEntityX, this.globalEntityY, Math.abs(this.direction.x * this.speed), this.hitbox);
            }

            if (this.direction.y < 0) {
                this.globalEntityY = map.topFree(this.globalEntityX, this.globalEntityY, Math.abs(this.direction.y * this.speed), this.hitbox);
            } else if (this.direction.y > 0) {
                this.globalEntityY = map.downFree(this.globalEntityX, this.globalEntityY, this.direction.y * this.speed, this.hitbox);
            }

            this.distanceTraveled += Math.hypot(this.globalEntityX - oldX, this.globalEntityY - oldY);

            if (this.distanceTraveled >= this.maxRange) {
                this.returning = true;
            }
        } else {
            // Kehre zurück
            if (this.config.shooter) {
                const dx = this.config.shooter.globalEntityX - this.globalEntityX;
                const dy = this.config.shooter.globalEntityY - this.globalEntityY;
                const dist = Math.hypot(dx, dy);

                if (dist < 30) {
                    this.isAlive = false;
                    return;
                }

                const returnDir = { x: dx / dist, y: dy / dist };
                this.globalEntityX += returnDir.x * this.speed;
                this.globalEntityY += returnDir.y * this.speed;
            }
        }
    }

    draw(ctx, player) {
        const screenX = this.globalEntityX - player.globalEntityX + player.canvasWidthMiddle;
        const screenY = this.globalEntityY - player.globalEntityY + player.canvasWidthHeight;

        ctx.save();
        ctx.fillStyle = this.returning ? 'rgba(255, 100, 0, 0.8)' : 'rgba(200, 50, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
