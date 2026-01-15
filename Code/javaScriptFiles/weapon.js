import {Projectile} from "./projectile.js";
import {Item} from "./item.js";
import {Enemy} from "./enemy.js";

export class Weapon extends Item {
    constructor(icon, description, picture, dmg, cooldown, focus, splash, range, lvl, amount, shooter, mapWidth, mapHeight, gridWidth, projectileSize = 8, projectileDuration = -1, orbiting = false, orbitProperties = null, isAura = false, auraRadius = 0, auraDmgInterval = 500) {
        super(icon, description, picture);
        this.dmg = dmg;
        this.cooldown = cooldown; // Time between shots in milliseconds
        this.focus = focus;
        this.splash = splash;
        this.range = range;
        this.lvl = lvl;
        this.amount = amount;
        this.lastShotTime = 0; // Timestamp of the last shot
        this.shooter=shooter
        this.projectiles = []
        this.projectileSize = projectileSize;
        this.projectileDuration = projectileDuration;
        this.orbiting = orbiting;
        this.orbitProperties = orbitProperties;

        // Aura-spezifische Eigenschaften
        this.isAura = isAura;
        this.auraRadius = auraRadius;
        this.auraDmgInterval = auraDmgInterval;
        this.lastAuraDmgTime = 0;
        this.auraColor = 'rgba(255, 255, 100, 0.3)'; // Leicht gelb, durchsichtig

        if (!(shooter instanceof Enemy) && !orbiting){
            for (let row = 0; row<=Math.floor(mapHeight / (gridWidth)) ;row++){
                this.projectiles[row] = []
                for (let column = 0; column<=Math.floor(mapWidth / (gridWidth));column++){
                    this.projectiles[row][column] ={within: []}
                }
            }
        }
    }

    static create(type, shooter, mapWidth, mapHeight, gridWidth) {
        switch (type) {
            case "basic":
                return new BasicWeapon(shooter, mapWidth, mapHeight, gridWidth);

            case "basicEnemy":
                return new BasicEnemyWeapon(shooter, mapWidth, mapHeight, gridWidth);

            case "shotgun":
                return new ShotgunWeapon(shooter, mapWidth, mapHeight, gridWidth);

            case "sniper":
                return new SniperWeapon(shooter, mapWidth, mapHeight, gridWidth);

            case "shuriken":
                return new ShurikanWeapon(shooter, mapWidth, mapHeight, gridWidth);

            case "aura":
                return new AuraWeapon(shooter, mapWidth, mapHeight, gridWidth);

            default:
                return new DefaultWeapon(shooter, mapWidth, mapHeight, gridWidth);
        }
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth) {
        // Check if the cooldown has passed
        if (currentTime - this.lastShotTime < this.cooldown) {
            return; // Still on cooldown
        }

        let isEnemyShooter = this.shooter instanceof Enemy
        let targetEntity
        if (isEnemyShooter)
            targetEntity = player
        if (this.shooter instanceof Enemy && !(this.shooter.shouldShoot(player))) {
            return
        }
        // Nur für den Spieler relevant: Wenn kein Ziel direkt vorgegeben ist,
        // dann abbrechen, falls es keine Gegner gibt.
        if (!targetEntity && enemies.length === 0) {
            return; // keine Gegner für Auto-Fokus
        }

        this.lastShotTime = currentTime;

        // Create projectiles
        for (let j = 0; j < this.amount; j++) {
            let dir
            if (targetEntity) {
                // Gegner schießt gezielt auf targetEntity (z. B. den Player)
                const dx = targetEntity.globalEntityX - this.shooter.globalEntityX;
                const dy = targetEntity.globalEntityY - this.shooter.globalEntityY;
                const angle = Math.atan2(dy, dx);
                dir = { x: Math.cos(angle), y: Math.sin(angle) };
            } else if (this.focus === 1) {
                // Spieler zielt wie bisher auf den nächsten Gegner
                let closestEnemy = {enemy: null, distance: 99999}
                for (let i = enemies.length - 1; i >= 0; i--) {
                    for (let n = enemies[i].length -1 ; n>= 0; n--){
                        for (let enemy of enemies[i][n].within){
                            let distanceX = this.shooter.globalEntityX - enemy.globalEntityX
                            let distanceY = this.shooter.globalEntityY - enemy.globalEntityY
                            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                            if (distance < closestEnemy.distance) {
                                closestEnemy = {enemy: enemy, distance: distance}
                            }
                        }
                    }
                }
                if (closestEnemy.enemy) {
                    let distanceX = (closestEnemy.enemy.globalEntityX - this.shooter.globalEntityX)
                    let distanceY = (closestEnemy.enemy.globalEntityY - this.shooter.globalEntityY)
                    let angle = Math.atan2(distanceY, distanceX);
                    dir = {x: Math.cos(angle), y: Math.sin(angle)};
                }
                else {
                    let angle = Math.random() * Math.PI * 2;
                    dir = {x: Math.cos(angle), y: Math.sin(angle)};
                }
            } else {
                // Zufällige Richtung
                const angle = Math.random() * Math.PI * 2;
                dir = { x: Math.cos(angle), y: Math.sin(angle) }
            }
            const p = new Projectile(this.shooter.globalEntityX,
                this.shooter.globalEntityY, 1,
                null,
                (isEnemyShooter ? 3 : 5),
                {width: this.projectileSize, height: this.projectileSize},
                false,
                this.projectileSize,
                dir,
                this.dmg,
                isEnemyShooter,
                {column : Math.floor(player.globalEntityX/ (gridWidth*tilelength)), row : Math.floor(player.globalEntityY / (gridWidth*tilelength))},
                currentTime, this.projectileDuration
            );
            if (this.shooter instanceof Enemy){
                this.projectiles.push(p)
            }else{
                this.projectiles[p.gridMapTile.row][p.gridMapTile.column].within.push(p)
            }
        }
    }

    render(ctx, PlayerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops){
        if (Game.testShoot === true) {
            this.shoot(
                PlayerOne,
                performanceNow,
                enemies,
                map.tilelength,
                gridWidth
            )
        }

        // Render normal projectiles (nicht orbiting)
        if (this.shooter instanceof Enemy){
            for (let j = this.projectiles.length-1; j>= 0; j--){
                let projectile = this.projectiles[j]
                projectile.render(ctx, this.projectiles, j, enemies, PlayerOne, map, gridWidth, enemyItemDrops, performanceNow)
            }
        }else{
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                for (let n = this.projectiles[i].length - 1; n >= 0; n--){
                    for (let j = this.projectiles[i][n].within.length - 1; j >= 0 ;j--){
                        let projectile = this.projectiles[i][n].within[j]
                        projectile.render(ctx, this.projectiles, j, enemies, PlayerOne, map, gridWidth, enemyItemDrops, performanceNow)
                    }
                }
            }
        }
    }
}

// ===== WAFFEN-SUBKLASSEN =====

export class BasicWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Basic Gun", null, 100, 300, 1, 0, 1000, 1, 1, shooter, mapWidth, mapHeight, gridWidth);
    }
}

export class BasicEnemyWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Basic Gun", null, 10, 300, 1, 0, 1000, 1, 1, shooter, mapWidth, mapHeight, gridWidth);
    }
}

export class ShotgunWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Shotgun", null, 60, 800, 0, 0, 500, 1, 6, shooter, mapWidth, mapHeight, gridWidth, 16, 1250);
    }
}

export class SniperWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Sniper", null, 300, 1200, 0, 0, 2000, 1, 1, shooter, mapWidth, mapHeight, gridWidth);
    }
}

export class ShurikanWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Shurikan", null, 25, 150, 1, 0, 700, 1, 3, shooter, mapWidth, mapHeight, gridWidth, 6, 1000, true, { radius: 100, speed: 2 });
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth) {
        // Shurikan: Orbiting projectiles
        if (this.projectiles.length < this.amount) {
            for (let i = 0; i < this.amount; i++) {
                const angle = (2 * Math.PI / this.amount) * i;
                const p = new Projectile(
                    this.shooter.globalEntityX,
                    this.shooter.globalEntityY,
                    1, null, 0,
                    {width: this.projectileSize, height: this.projectileSize},
                    true, this.projectileSize, {}, this.dmg, false, {},
                    currentTime, -1, true,
                    {
                        radius: this.orbitProperties.radius,
                        speed: this.orbitProperties.speed,
                        shooter: this.shooter,
                        angle: angle
                    }
                );
                this.projectiles.push(p);
            }
        }
    }

    render(ctx, PlayerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops){
        // Shurikan ist eine orbiting weapon - schießt orbiting Projektile
        if (Game.testShoot === true) {
            this.shoot(
                PlayerOne,
                performanceNow,
                enemies,
                map.tilelength,
                gridWidth
            )
        }

        // Render orbiting projectiles
        for (let j = this.projectiles.length-1; j>= 0; j--){
            let projectile = this.projectiles[j]
            projectile.render(ctx, this.projectiles, j, enemies, PlayerOne, map, gridWidth, enemyItemDrops, performanceNow)
        }
    }
}

export class AuraWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Aura", null, 15, 0, 0, 0, 0, 1, 1, shooter, mapWidth, mapHeight, gridWidth, 8, -1, false, null, true, 150, 500);
    }

    render(ctx, PlayerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops){
        // Aura schießt keine Projektile - zeichnen und Schaden zufügen
        this.draw(ctx, PlayerOne);
        this.damageEnemies(enemies, performanceNow);
    }

    draw(ctx, playerOne) {
        const screenX = this.shooter.globalEntityX - playerOne.globalEntityX + playerOne.canvasWidthMiddle;
        const screenY = this.shooter.globalEntityY - playerOne.globalEntityY + playerOne.canvasWidthHeight;

        // Zeichne den Aura-Kreis
        ctx.fillStyle = this.auraColor;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Optionaler Border
        ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    damageEnemies(enemies, currentTime) {
        // Sammle alle Gegner, die Schaden nehmen sollen
        const enemiesToDamage = [];

        // Durchsuche alle Gegner
        for (let row = 0; row < enemies.length; row++) {
            for (let column = 0; column < enemies[row].length; column++) {
                for (let i = 0; i < enemies[row][column].within.length; i++) {
                    const enemy = enemies[row][column].within[i];
                    const distX = enemy.globalEntityX - this.shooter.globalEntityX;
                    const distY = enemy.globalEntityY - this.shooter.globalEntityY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    // Wenn Gegner im Radius, zur Liste hinzufügen
                    if (distance <= this.auraRadius) {
                        // Initialisiere Cooldown für diesen Gegner, falls nicht vorhanden
                        if (!enemy.lastAuraDmgTime) {
                            enemy.lastAuraDmgTime = 0;
                        }

                        // Überprüfe individuelle Cooldown für diesen Gegner
                        if (currentTime - enemy.lastAuraDmgTime >= this.auraDmgInterval) {
                            enemy.lastAuraDmgTime = currentTime;
                            enemiesToDamage.push({ enemy, row, column, index: i });
                        }
                    }
                }
            }
        }

        // Verteile Schaden NACH der Iteration - nur HP reduzieren, nicht löschen
        for (let dmgInfo of enemiesToDamage) {
            const enemy = dmgInfo.enemy;
            // Reduziere nur die HP, ohne takeDmg() zu verwenden (das würde löschen)
            enemy.hp -= this.dmg;

            // Wenn HP <= 0, merke den Gegner für später
            if (enemy.hp <= 0) {
                enemy.hp = 0;
            }
        }

        // NACH allen Schaden-Berechnungen: Lösche tote Gegner rückwärts
        for (let row = enemies.length - 1; row >= 0; row--) {
            for (let column = enemies[row].length - 1; column >= 0; column--) {
                for (let i = enemies[row][column].within.length - 1; i >= 0; i--) {
                    const enemy = enemies[row][column].within[i];
                    if (enemy.hp <= 0) {
                        enemies[row][column].within.splice(i, 1);
                    }
                }
            }
        }
    }
}

export class DefaultWeapon extends Weapon {
    // FALLBACK-WAFFE: Standard Logik ohne Spezialeffekte
    // Erbt alle Methoden direkt von der Basis-Klasse (shoot, render)
    // Verwendet keine Custom-Logik, daher keine Überschreibungen nötig
    constructor(shooter, mapWidth, mapHeight, gridWidth) {
        super(null, "Default", null, 5, 500, 0, 0, 800, 1, 2, shooter, mapWidth, mapHeight, gridWidth);
    }
}

