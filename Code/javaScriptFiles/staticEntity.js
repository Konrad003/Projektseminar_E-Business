import { Entity } from "./entity.js";
export class StaticEntity extends Entity{
    
    constructor(globalX, globalY, hitbox, png) {
        super(globalEntityX, globalEntityY, hitbox, png)
        this.globalX = globalX
        this.globalY = globalY
        this.hitbox = hitbox
        this.png = png
    }

    checkCollision() { // wird noch implementiert
    }

    draw() { // wird noch implementiert
    }
}