import {MovingEntity} from "./movingEntity.js";

export class Projectile extends MovingEntity {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, piercing, size, direction, dmg, isEnemy = false, gridMapTile, creationTime, duration, orbiting = false, orbitProperties = null) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox);
        this.piercing = piercing;
        this.size = size;
        this.direction = direction;
        this.dmg = dmg;
        this.isEnemy = isEnemy;
        this.gridMapTile = gridMapTile
        this.creationTime = creationTime;
        this.duration = duration;
        this.orbiting = orbiting;
        this.orbitProperties = orbitProperties;
    }

    handleProjectiles(ctx, projectiles, projectileIndex, enemies, player, map, gridWidth, enemyItemDrops, currentTime) {
        // Loop through projectiles for movement, drawing, and collision
        let killCount=0
        // 1. Move projectile
        this.move(map, projectiles, projectileIndex, gridWidth, player, currentTime);
        // 2. Draw projectile relative to the camera/player
        this.draw(ctx, player);
        // 3. Check collision with Player
        if (this.isEnemy) {
        // Feindliches Projektil trifft den Spieler
          if (this.checkCollision(player, 0, 0)) {
            player.takeDmg(this.dmg);
            // Feindliche Projektile sind i. d. R. nicht piercing:
            projectiles.splice(projectileIndex, 1);
            }
        } else {
            // Spieler-Projektil trifft Gegner
            for (let i = enemies.length - 1; i >= 0; i--) {
                for (let n = enemies[i].length - 1; n >= 0; n--) {
                    for (let j = enemies[i][n].within.length - 1; j >= 0 ;j--) {
                        let enemy = enemies[i][n].within[j]
                        if (this.checkCollision(enemy, 0, 0)) {
                            // Fireball-Projektile triggern Explosion statt direkten Schaden
                            if (!this.isFireball) {
                                enemy.takeDmg(this.dmg, enemies, j, enemyItemDrops);
                            }
                            // Nur normal Projektile aus Grid löschen, nicht Fireballs
                            if (!this.piercing && !this.isFireball) {
                                projectiles[this.gridMapTile.row][this.gridMapTile.column].within.splice(projectileIndex, 1)
                            }else if (this.isFireball) {
                                // Fireball: Explosion triggern
                                this.exploded = true;
                                this.explodedTime = currentTime;
                            }
                            // Since the projectile is gone, break the inner loop and continue to the next projectile
                            break;
                        }
                    }
                }
            }
        }
        // Timeout handling - aber nur für Nicht-Fireballs
        if (this.duration > 0 && currentTime - this.creationTime > this.duration) {
            if (this.isEnemy) projectiles.splice(projectileIndex);
            else if (!this.isFireball) projectiles[this.gridMapTile.row][this.gridMapTile.column].within.splice(projectileIndex, 1);
        }
    }


    move(map, projectiles, projectileIndex, gridWidth, player, currentTime) {
        if (this.orbiting) {
            const { radius, speed, shooter } = this.orbitProperties;
            const time = (currentTime - this.creationTime) / 1000; // in seconds
            this.globalEntityX = shooter.globalEntityX + radius * Math.cos(time * speed + this.orbitProperties.angle);
            this.globalEntityY = shooter.globalEntityY + radius * Math.sin(time * speed + this.orbitProperties.angle);
            return;
        }
        // Fireball und Enemy Projektile nutzen einfaches Array
        let position
        if (!(this.isEnemy) && !this.isFireball) position=this.updateGridPlace(map.tilelength, projectiles, projectileIndex, gridWidth)
        // direction is a vector like {x: 0.5, y: -0.2}
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
        if ((oldGlobalEntityX === this.globalEntityX && this.direction.x !== 0) || (oldGlobalEntityY === this.globalEntityY && this.direction.y !== 0)) { // Kollision mit Wand
            if (this.isEnemy || this.isFireball)projectiles.splice(projectileIndex)
            else projectiles[position.gridMapTile.row][position.gridMapTile.column].within.splice(position.positionWithin, 1);
        }
    }

    render(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne, gridWidth, enemyItemDrops, currentTime){
        this.handleProjectiles(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne, gridWidth, enemyItemDrops, currentTime)
    }

    getColor() {
        if (this.isFireball) {
            return this.fireballColor || 'rgba(255, 50, 0, 0.9)'; // Fireball ist rot-orange
        }
        return this.isEnemy ? 'orange' :'cyan'
    }
}