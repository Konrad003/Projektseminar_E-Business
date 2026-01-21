import { Item } from "./item.js";
import { Enemy } from "./enemy.js";
import { getWeaponConfig, createProjectileConfig } from "./weapon-config.js";

export class Weapon extends Item {
    constructor(config, shooter, mapWidth, mapHeight, gridWidth) {
        super(config?.icon || null, config?.name || "Weapon", config?.picture || null);

        this.config = config;
        this.shooter = shooter;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.gridWidth = gridWidth;

        // Kopiere häufig genutzte Felder aus Config
        this.dmg = config.dmg;
        this.cooldown = config.cooldown;
        this.range = config.range;
        this.piercing = config.piercing || 0;

        // Speichern für Projektile
        this.projectiles = [];
        this.lastShotTime = 0;

        // Initialisiere Grid falls Player-Waffe
        this._initializeStorage(shooter);
    }

    /**
     * Initialisiere Speicher-Struktur basierend auf Schütze
     */
    _initializeStorage(shooter) {
        if (!(shooter instanceof Enemy)) {
            // Player: nutze Grid
            for (let row = 0; row <= Math.floor(this.mapHeight / this.gridWidth); row++) {
                this.projectiles[row] = [];
                for (let column = 0; column <= Math.floor(this.mapWidth / this.gridWidth); column++) {
                    this.projectiles[row][column] = { within: [] };
                }
            }
        }
        // Enemy: nutze einfaches Array (wird später aufgebaut)
    }


    //FACTORY-METHODE: Erstelle Waffe aus Config


    static create(type, shooter, mapWidth, mapHeight, gridWidth) {
        const config = getWeaponConfig(type);

        // Sicherheitscheck
        if (!config) {
            console.error(`Waffen-Config für "${type}" nicht gefunden!`);
            return null;
        }

        // Spezial-Waffen mit Custom-Logik
        if (config.isSpecial) {
            switch (type) {
                case "sword": return new SwordWeapon(shooter, mapWidth, mapHeight, gridWidth);
                case "shuriken": return new ShurikenWeapon(shooter, mapWidth, mapHeight, gridWidth);
                case "thunderstrike": return new ThunderstrikeWeapon(shooter, mapWidth, mapHeight, gridWidth);
                case "aura": return new AuraWeapon(shooter, mapWidth, mapHeight, gridWidth);
            }
        }

        // Standard-Waffen: nutze generische Klasse
        return new Weapon(config, shooter, mapWidth, mapHeight, gridWidth);
    }

    /**
     * SCHUSS-LOGIK
     * Template-Method: Subklassen können überschreiben
     */
    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        // Cooldown-Check
        if (currentTime - this.lastShotTime < this.cooldown) {
            return;
        }
        this.lastShotTime = currentTime;

        // Ziel-Bestimmung
        const target = this.determineTarget(player, enemies);
        if (!target) return;

        // Direction berechnen
        const direction = this.calculateDirection(target);

        // Projektile erstellen (Config-driven)
        this.createProjectiles(target, direction, currentTime, tilelength, gridWidth, player);
    }

    /**
     * Bestimme Ziel (nächster Gegner oder Spieler)
     */
    determineTarget(player, enemies) {
        const isEnemyShooter = this.shooter instanceof Enemy;

        if (isEnemyShooter) {
            // Enemy schießt auf Player
            if (!this.shooter.shouldShoot(player)) return null;
            return player;
        } else {
            // Player schießt auf nächsten Gegner
            return this.findClosestEnemy(enemies);
        }
    }

    /**
     * Finde nächsten Gegner im Grid
     */
    findClosestEnemy(enemies) {
        let closestEnemy = null;
        let closestDist = this.range;

        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let enemy of enemies[i][n].within) {
                    const dx = enemy.globalEntityX - this.shooter.globalEntityX;
                    const dy = enemy.globalEntityY - this.shooter.globalEntityY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < closestDist) {
                        closestDist = dist;
                        closestEnemy = enemy;
                    }
                }
            }
        }

        return closestEnemy;
    }

    /**
     * Berechne Direction zum Ziel
     */
    calculateDirection(target) {
        if (!target) {
            return { x: 1, y: 0 }; // Fallback: rechts
        }

        const dx = target.globalEntityX - this.shooter.globalEntityX;
        const dy = target.globalEntityY - this.shooter.globalEntityY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) return { x: 1, y: 0 };

        return {
            x: dx / dist,
            y: dy / dist
        };
    }

    /**
     * PROJEKTIL-ERSTELLUNG (Config-driven)
     * Das meiste ist jetzt Config → keine Subklassen-Überladung nötig
     */
    createProjectiles(target, direction, currentTime, tilelength, gridWidth, player) {
        const ProjectileClass = this.config.projectile;

        // Grid-Position für Player-Projektile
        const isPlayer = !(this.shooter instanceof Enemy);
        const cellSize = gridWidth * tilelength;
        const gridMapTile = isPlayer ? {
            column: Math.max(0, Math.floor(this.shooter.globalEntityX / cellSize)),
            row: Math.max(0, Math.floor(this.shooter.globalEntityY / cellSize))
        } : {};

        // Erstelle Projectile(s)
        const projectiles = this._instantiateProjectiles(
            ProjectileClass,
            direction,
            gridMapTile,
            currentTime,
            isPlayer
        );

        // Füge zu Speicher hinzu (Projectile entscheidet!)
        for (let projectile of projectiles) {
            projectile.addTo(this.projectiles);
        }
    }

    /**
     * Instanziiere Projectile basierend auf Typ
     * Kann in Subklassen erweitert werden für mehrere Projektile
     */
    _instantiateProjectiles(ProjectileClass, direction, gridMapTile, currentTime, isPlayer) {
        const projectile = new ProjectileClass(
            this.shooter.globalEntityX,
            this.shooter.globalEntityY,
            direction,
            this.dmg,
            this.config.projectileConfig,
            gridMapTile,
            currentTime,
            !isPlayer  // isEnemy Flag
        );

        return [projectile];
    }

    /**
     * TEMPLATE METHOD: Render-Logik für diese Waffe
     * Wird von Player aufgerufen in render()
     */
    render(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops, inputState = null) {
        // Update Waffe (Cooldown, etc.)
        this.update(performanceNow);

        // Render Projektile
        this.renderProjectiles(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops);

        // Render spezielle Effekte (überschreiben in Subklassen)
        this.renderEffects(ctx, playerOne, performanceNow);
    }

    /**
     * Update Waffen-State (z.B. Cooldown)
     */
    update(currentTime) {
        // Standard: Nichts zu tun
        // Subklassen können überschreiben
    }

    /**
     * RENDERING
     * VEREINFACHT: Keine 3-fach if-Branches mehr!
     * Projectiles kümmern sich selbst um Update/Draw
     */
    renderProjectiles(ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops) {
        // Unterscheide nur: Grid vs Array (bestimmt durch Shooter)
        if (this.shooter instanceof Enemy) {
            // Enemy: einfaches Array
            this._renderArray(this.projectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops);
        } else {
            // Player: Grid oder Array (Projectile entscheidet)
            this._renderGrid(this.projectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops);
        }
    }

    /**
     * Rendere einfaches Array
     */
    _renderArray(projectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops) {
        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j];
            if (projectile && projectile.handleProjectile) {
                projectile.handleProjectile(ctx, projectiles, j, enemies, playerOne, map, gridWidth, enemyItemDrops, performanceNow);
            }
        }
    }

    /**
     * Rendere Grid
     */
    _renderGrid(projectiles, ctx, playerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            for (let n = projectiles[i].length - 1; n >= 0; n--) {
                for (let j = projectiles[i][n].within.length - 1; j >= 0; j--) {
                    const projectile = projectiles[i][n].within[j];
                    if (projectile && projectile.handleProjectile) {
                        projectile.handleProjectile(ctx, projectiles[i][n].within, j, enemies, playerOne, map, gridWidth, enemyItemDrops, performanceNow);
                    }
                }
            }
        }
    }

    /**
     * Optional: Render spezielle Effekte (überschreiben in Subklassen)
     */
    renderEffects(ctx, playerOne, performanceNow) {
        // Wird von Special-Waffen überschrieben
    }
}


// ============ SPECIAL WEAPONS (nur Custom-Logik) ============

/**
 * SwordWeapon: Schwert mit Rotation
 * WARUM SPECIAL: Eindeutige Schlag-Animation + Winkel-Tracking
 */
export class SwordWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        const config = getWeaponConfig("sword");
        super(config, shooter, mapWidth, mapHeight, gridWidth);
        this.lastSlashAngle = Math.PI * 1.5;
    }

    createProjectiles(target, direction, currentTime, tilelength, gridWidth, player) {
        // Bestimme Winkel (bevorzuge nächsten Gegner)
        let startAngle = this.lastSlashAngle;
        if (target) {
            const dx = target.globalEntityX - this.shooter.globalEntityX;
            const dy = target.globalEntityY - this.shooter.globalEntityY;
            startAngle = Math.atan2(dy, dx);
        }
        this.lastSlashAngle = startAngle;

        const cellSize = gridWidth * tilelength;
        const gridMapTile = {
            column: Math.max(0, Math.floor(this.shooter.globalEntityX / cellSize)),
            row: Math.max(0, Math.floor(this.shooter.globalEntityY / cellSize))
        };

        const SlashProjectile = this.config.projectile;
        const projectile = new SlashProjectile(
            this.shooter.globalEntityX,
            this.shooter.globalEntityY,
            direction,
            this.dmg,
            this.config.projectileConfig,
            gridMapTile,
            performance.now(),
            startAngle
        );

        projectile.addTo(this.projectiles);
    }
}

/**
 * ShurikenWeapon: Orbiting Sterne
 * WARUM SPECIAL: Mehrere Projektile, konstantes Orbiting (passiv, dauerhaft aktiv)
 */
export class ShurikenWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        const config = getWeaponConfig("shuriken");
        super(config, shooter, mapWidth, mapHeight, gridWidth);

        // Eigenes Array für Shuriken (nicht Grid!)
        this.shurikenProjectiles = [];

        // Erstelle Shuriken einmalig beim Spawnen
        this.initializeShuriken();
    }

    initializeShuriken() {
        const amount = this.config.projectileConfig.amount || 3;

        console.log(`ShurikenWeapon: Erstelle ${amount} Shuriken`);

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

/**
 * ThunderstrikeWeapon: Blitz-Attacke
 * WARUM SPECIAL: Keine Projektile, nur Damage-Effekt + Custom shoot()
 */
export class ThunderstrikeWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        const config = getWeaponConfig("thunderstrike");
        super(config, shooter, mapWidth, mapHeight, gridWidth);
        this.lastLightningTime = 0;
        this.lastLightningDirections = [];
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth, inputState = null, enemyItemDrops = []) {
        if (currentTime - this.lastShotTime < this.cooldown) return;
        this.lastShotTime = currentTime;

        const target = this.determineTarget(player, enemies);
        const baseDir = this.calculateDirection(target);
        const baseAngle = Math.atan2(baseDir.y, baseDir.x);

        this.lastLightningDirections = [];
        const lightningCount = this.config.projectileConfig.lightningCount;
        const spreadAngle = Math.PI / 6;

        // Erzeugen Blitze in verschiedene Richtungen
        for (let i = 0; i < lightningCount; i++) {
            const offset = (i - (lightningCount - 1) / 2) * (spreadAngle / (lightningCount - 1));
            const lightningAngle = baseAngle + offset;
            const lightningDir = { x: Math.cos(lightningAngle), y: Math.sin(lightningAngle) };

            this.lastLightningDirections.push(lightningDir);
            this.damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops);
        }

        this.lastLightningTime = currentTime;
    }

    damageEnemiesInLine(enemies, lightningAngle, enemyItemDrops) {
        const lightningLength = this.config.projectileConfig.lightningLength;

        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    const enemy = enemies[i][n].within[j];
                    const dx = enemy.globalEntityX - this.shooter.globalEntityX;
                    const dy = enemy.globalEntityY - this.shooter.globalEntityY;
                    const distToEnemy = Math.sqrt(dx * dx + dy * dy);

                    if (distToEnemy <= lightningLength) {
                        const angleToEnemy = Math.atan2(dy, dx);
                        const angleDiff = Math.abs(angleToEnemy - lightningAngle);

                        if (angleDiff < Math.PI / 12 || Math.abs(angleDiff - Math.PI * 2) < Math.PI / 12) {
                            enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                        }
                    }
                }
            }
        }
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

/**
 * AuraWeapon: Passive defensive Aura
 * WARUM SPECIAL: Keine Projektile, nur Damage-Loop
 */
export class AuraWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        const config = getWeaponConfig("aura");
        super(config, shooter, mapWidth, mapHeight, gridWidth);
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

        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let n = enemies[i].length - 1; n >= 0; n--) {
                for (let j = enemies[i][n].within.length - 1; j >= 0; j--) {
                    const enemy = enemies[i][n].within[j];
                    const dx = enemy.globalEntityX - this.shooter.globalEntityX;
                    const dy = enemy.globalEntityY - this.shooter.globalEntityY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < auraRadius) {
                        enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                    }
                }
            }
        }
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
