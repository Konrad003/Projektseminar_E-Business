import { MovingEntity } from "./MovingEntity.js"
export class projectile extends MovingEntity {

    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, piercing, size, direction, dmg) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
        this.piercing = piercing
        this.speed = speed
        this.size = size
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.direction = direction
        this.dmg  = dmg
        this.hp = hp
        this.png = png
        this.hitbox = hitbox
    }

    checkCollision() {

    }

    move() { // wird noch implementiert
        
    }
}