import {Projectile} from "./projectile.js";
import {Item} from "./item.js";

export class Weapon extends Item {
    constructor(icon, description, picture, dmg, cooldown, focus, splash, range, lvl, amount) {
        super(icon, description, picture);
        this.dmg = dmg;
        this.cooldown = cooldown; // Time between shots in milliseconds
        this.focus = focus;
        this.splash = splash;
        this.range = range;
        this.lvl = lvl;
        this.amount = amount;
        this.lastShotTime = 0; // Timestamp of the last shot
    }

    static create(type) {
        switch (type) {
            case "basic":
                return new Weapon(null, "Basic Gun", null, 10, 300, 1, 0, 1000, 1, 1);


            case "shotgun":
                return new Weapon(null, "Shotgun", null, 6, 800, 0, 0, 500, 1, 6);


            case "sniper":
                return new Weapon(null, "Sniper", null, 30, 1200, 0, 0, 2000, 1, 1);


            default:
                return new Weapon(null, "Default", null, 5, 500, 0, 0, 800, 1, 1);
        }
    }

    shoot(shooter, projectiles, currentTime, enemies, targetEntity = null, isEnemyShooter = false) {
        // Check if the cooldown has passed
        if (currentTime - this.lastShotTime < this.cooldown) {
            return; // Still on cooldown
        }
        
        // Nur für den Spieler relevant: Wenn kein Ziel direkt vorgegeben ist,
        // dann abbrechen, falls es keine Gegner gibt.
        if (!targetEntity && enemies.length === 0) {
            return; // keine Gegner für Auto-Fokus
        }

        this.lastShotTime = currentTime;


        // Create a projectile
        for (let i = 0; i < this.amount; i++) {
            let dir
            if (targetEntity) {
                // Gegner schießt gezielt auf targetEntity (z. B. den Player)
                const dx = targetEntity.globalEntityX - shooter.globalEntityX;
                const dy = targetEntity.globalEntityY - shooter.globalEntityY;
                const angle = Math.atan2(dy, dx);
                dir = { x: Math.cos(angle), y: Math.sin(angle) };
            } else if (this.focus === 1) {
                // Spieler zielt wie bisher auf den nächsten Gegner
                let closestEnemy = {enemy: null, distance: 99999}
                for (let i = enemies.length - 1; i >= 0; i--) {
                    let enemy = enemies[i]
                    let distanceX = shooter.globalEntityX - enemy.globalEntityX
                    let distanceY = shooter.globalEntityY - enemy.globalEntityY

                    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY) //Hypotenuse von Enemy zu Player berechnet distance
                    if (distance < closestEnemy.distance) {
                        closestEnemy = {enemy: enemy, distance: distance}
                    }
                }
                if (closestEnemy.enemy) {
                    let distanceX = (closestEnemy.enemy.globalEntityX - shooter.globalEntityX)
                    let distanceY = (closestEnemy.enemy.globalEntityY - shooter.globalEntityY)
                    let angle = Math.atan2(distanceY, distanceX);
                    dir = {x: Math.cos(angle), y: Math.sin(angle)};
                }
                else {
                    let angle = Math.random() * Math.PI * 2; // Fires in a random direction
                    dir = {x: Math.cos(angle), y: Math.sin(angle)};
                }
            } else {
                // Zufällige Richtung
                const angle = Math.random() * Math.PI * 2;
                dir = { x: Math.cos(angle), y: Math.sin(angle) }
            }
            
            const p = new Projectile(shooter.globalEntityX, // Use the player's current position
                shooter.globalEntityY, 1, // hp
                null, // png
                (isEnemyShooter ? 3 : 5), // langsamer für Gegner-Projektile (z. B. 3 statt 5)
                {width: 8, height: 8}, // hitbox
                false, // piercing
                8, // size
                dir, // direction
                this.dmg, // damage
                isEnemyShooter            // NEU: markiert feindliche Projektile
            );
            projectiles.push(p); // Add the projectile to the game's array
        }
    }

    render(ctx, PlayerOne, projectiles, performanceNow, enemies, map){
        this.shoot(PlayerOne, projectiles, performanceNow, enemies)
        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            let projectile = projectiles[projectileIndex]
            projectile.render(ctx, projectiles, projectileIndex, enemies, PlayerOne, map)
        }
    }
}