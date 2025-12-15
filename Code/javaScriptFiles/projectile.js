import {MovingEntity} from "./movingEntity.js";

export class Projectile extends MovingEntity {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, piercing, size, direction, dmg) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox);
        this.piercing = piercing;
        this.size = size;
        this.direction = direction;
        this.dmg = dmg;
    }

    handleProjectiles(ctx, projectiles, enemies, player, map) {
        // Loop through projectiles for movement, drawing, and collision
        let killCount=0
        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            let projectile = projectiles[projectileIndex];

            // 1. Move projectile
            projectile.move(map, projectiles, projectileIndex);

            // 2. Draw projectile relative to the camera/player
            let leftBorder = player.globalEntityX - map.FOVwidth / 2;
            let topBorder = player.globalEntityY - map.FOVheight / 2;

            projectile.draw(ctx, player, "lightblue");

            // Projectile entfernen, wenn es außerhalb der Kartenbegrenzungen ist
            if (projectile.globalEntityX < 0 || projectile.globalEntityX > map.mapWidth || projectile.globalEntityY < 0 || projectile.globalEntityY > map.mapHeight) {
                projectiles.splice(projectileIndex, 1);
                continue; // Continue to the next projectile
            }

            // 3. Check collision with enemies
            for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemies[enemyIndex];

                if (projectile.checkCollision(enemy, 0, 0)) {
                    // On hit, remove both
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(projectileIndex, 1);

                    killCount++; // Notify game that an enemy was killed

                    enemy.die(); // Drop XP, etc.

                    // Since the projectile is gone, break the inner loop and continue to the next projectile
                    break;
                }
            }
        }
        return killCount
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

    render(ctx, projectiles, enemies, PlayerOne, MapOne){
        return this.handleProjectiles(ctx, projectiles, enemies, PlayerOne, MapOne)
    }
}