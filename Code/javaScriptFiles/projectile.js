import {MovingEntity} from "./movingEntity.js";

export class Projectile extends MovingEntity {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, piercing, size, direction, dmg, isEnemy = false) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox);
        this.piercing = piercing;
        this.size = size;
        this.direction = direction;
        this.dmg = dmg;
        this.isEnemy = isEnemy;
    }

    handleProjectiles(ctx, projectiles, projectileIndex, enemies, player, map) {
        // Loop through projectiles for movement, drawing, and collision
        let killCount=0
        // 1. Move projectile
        this.move(map, projectiles, projectileIndex);
        // 2. Draw projectile relative to the camera/player
        const color = this.isEnemy ? "purple" : "lightblue"; //damit gegnerische Projektile rot sind
        this.draw(ctx, player, color);
        // 3. Check collision with enemies

        if (this.isEnemy) {
        // Feindliches Projektil trifft den Spieler
        if (this.checkCollision(player, 0, 0)) {
            player.takeDmg(this.dmg);
            // Feindliche Projektile sind i. d. R. nicht piercing:
            projectiles.splice(projectileIndex, 1);
            // kein break nötig – wir sind aus der Funktion für dieses Projektil sowieso raus
        }
        } else {
        // Spieler-Projektil trifft Gegner
            for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemies[enemyIndex];

                if (this.checkCollision(enemy, 0, 0)) {
                    // statt instant kill, schaden zufügen
                    enemy.takeDmg(this.dmg);

                    //projektil entfernen
                    if (!this.piercing) {
                        projectiles.splice(projectileIndex, 1);
                    }
                    
                    // Gegner nur entfernen, wenn er durch den Schaden gestorben ist
                    if (enemy.hp <= 0) {
                        enemies.splice(enemyIndex, 1);
                        enemy.die(); // Drops etc.
                        killCount++; // Notify game that an enemy was killed
                    }

                    // Since the projectile is gone, break the inner loop and continue to the next projectile
                    break;
                }
            }
        }
    }

    move(map, projectiles, projectileIndex) {
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
            projectiles.splice(projectileIndex, 1);
        }
    }

    render(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne){
        this.handleProjectiles(ctx, projectiles, projectileIndex, enemies, PlayerOne, MapOne)
    }
}