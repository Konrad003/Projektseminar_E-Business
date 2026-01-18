import {Projectile} from "./projectile.js";
import {Item} from "./item.js";
import {Enemy} from "./enemy.js";

export class Weapon extends Item {
    constructor(icon, description, picture, dmg, cooldown, focus, splash, range, lvl, amount, shooter, mapWidth, mapHeight, gridWidth) {
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
        this.burstRemaining = 0;       // für equipment barrage: Wie viele Schüsse noch in der Warteschlange sind
        this.burstTimer = 0;       // Zeit bis zum nächsten Schuss der Salve
        this.burstDelay = 50;      // Verzögerung zwischen den Schüssen in ms
        if (!(shooter instanceof Enemy)){
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
                return new Weapon(null, "Basic Gun", null, 100, 300, 1, 0, 1000, 1, 1, shooter, mapWidth, mapHeight, gridWidth);

            case "basicEnemy":
                return new Weapon(null, "Basic Gun", null, 10, 300, 1, 0, 1000, 1, 1, shooter, mapWidth, mapHeight,  gridWidth);

            case "shotgun":
                return new Weapon(null, "Shotgun", null, 6, 800, 0, 0, 500, 1, 6, shooter, mapWidth, mapHeight,  gridWidth);


            case "sniper":
                return new Weapon(null, "Sniper", null, 30, 1200, 0, 0, 2000, 1, 1,shooter, mapWidth, mapHeight,  gridWidth);


            default:
                return new Weapon(null, "Default", null, 5, 500, 0, 0, 800, 1, 1, shooter, mapWidth, mapHeight,  gridWidth);
        }
    }

    shoot(player, currentTime, enemies, tilelength, gridWidth) {
        const effectiveCooldown = this.cooldown * (this.shooter.cooldownMultiplier || 1);

        if (currentTime - this.lastShotTime < effectiveCooldown) {
            return;
        }

        if (this.shooter instanceof Enemy && !(this.shooter.shouldShoot(player))) {
            return;
        }

        // Wenn keine Gegner da sind, nicht schießen
        if (!(this.shooter instanceof Enemy) && enemies.length === 0) {
            return;
        }

        // Salve initialisieren für equipment barrage
        this.lastShotTime = currentTime;
        // berechnen, wie viele Schüsse abgefeuert werden sollen
        this.burstRemaining = this.amount + (this.shooter.extraProjectiles || 0);
    }

    render(ctx, PlayerOne, performanceNow, enemies, map, gridWidth, enemyItemDrops){

        if (this.burstRemaining > 0) {
            if (performanceNow - this.burstTimer > this.burstDelay) {
                this.fireSingleProjectile(PlayerOne, enemies, map.tilelength, gridWidth);
                this.burstRemaining--;
                this.burstTimer = performanceNow;
            }
        }

        if (Game.testShoot === true) {
            this.shoot(
            PlayerOne,         // immer der Player 
            performanceNow,     // für cooldown
            enemies,          // enemies-Liste (wird hier nicht genutzt, da targetEntity gesetzt)
            map.tilelength,
            gridWidth
            )
        }

        if (this.shooter instanceof Enemy){
            for (let j = this.projectiles.length-1; j>= 0; j--){
                let projectile = this.projectiles[j]
                projectile.render(ctx, this.projectiles, j, enemies, PlayerOne, map, gridWidth)
            }
        }else{
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                for (let n = this.projectiles[i].length - 1; n >= 0; n--){
                    for (let j = this.projectiles[i][n].within.length - 1; j >= 0 ;j--){
                        let projectile = this.projectiles[i][n].within[j]
                        projectile.render(ctx, this.projectiles, j, enemies, PlayerOne, map, gridWidth, enemyItemDrops)
                    }
                }
            }
        }
    }

    fireSingleProjectile(player, enemies, tilelength, gridWidth) {
        let isEnemyShooter = this.shooter instanceof Enemy;
        let targetEntity = isEnemyShooter ? player : null;
        let dir;

        if (targetEntity) {

            // Gegner schießt gezielt auf targetEntity (z. B. den Player)
            const dx = targetEntity.globalEntityX - this.shooter.globalEntityX;
            const dy = targetEntity.globalEntityY - this.shooter.globalEntityY;
            const angle = Math.atan2(dy, dx);
            dir = { x: Math.cos(angle), y: Math.sin(angle) };
        } else if (this.focus === 1) {
            // Spieler zielt wie bisher auf den nächsten Gegner
            let closestEnemy = {enemy: null, distance: 99999};
            for (let i = enemies.length - 1; i >= 0; i--) {
                for (let n = enemies[i].length - 1; n >= 0; n--) {
                    for (let enemy of enemies[i][n].within) {
                        let distanceX = this.shooter.globalEntityX - enemy.globalEntityX;
                        let distanceY = this.shooter.globalEntityY - enemy.globalEntityY;
                        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                        if (distance < closestEnemy.distance) {
                            closestEnemy = {enemy: enemy, distance: distance};
                        }
                    }
                }
            }
            if (closestEnemy.enemy) {
                let distanceX = (closestEnemy.enemy.globalEntityX - this.shooter.globalEntityX);
                let distanceY = (closestEnemy.enemy.globalEntityY - this.shooter.globalEntityY);
                let angle = Math.atan2(distanceY, distanceX);
                dir = {x: Math.cos(angle), y: Math.sin(angle)};
            } else {
                let angle = Math.random() * Math.PI * 2; // Fires in a random direction
                dir = {x: Math.cos(angle), y: Math.sin(angle)};
            }
        } else {
            // Zufällige Richtung
            const angle = Math.random() * Math.PI * 2;
            dir = { x: Math.cos(angle), y: Math.sin(angle) };
        }

        const p = new Projectile(
            this.shooter.globalEntityX,// Use the player's current position
            this.shooter.globalEntityY,
            1, // hp
            null, // png
            (isEnemyShooter ? 3 : 5), // langsamer für Gegner-Projektile (z. B. 3 statt 5)
            {width: 8, height: 8}, // hitbox
            false, // piercing
            8, // size
            dir, // direction
            this.dmg * (this.shooter.damageMultiplier || 1), // damage, mulitiplier für equipment valor und 1 zur sicherheit.
            isEnemyShooter, // NEU: markiert feindliche Projektile
            {column: Math.floor(this.shooter.globalEntityX / (gridWidth * tilelength)), 
        row: Math.floor(this.shooter.globalEntityY / (gridWidth * tilelength))}  
        );

        if (isEnemyShooter) {
            this.projectiles.push(p);
            } else { // fehler abfangen
                if (this.projectiles[p.gridMapTile.row] && this.projectiles[p.gridMapTile.row][p.gridMapTile.column]) {
                    this.projectiles[p.gridMapTile.row][p.gridMapTile.column].within.push(p);
                } else {
                    console.warn("Projektil außerhalb des Grids geschossen!", p.gridMapTile);
                }
            }
        }
}