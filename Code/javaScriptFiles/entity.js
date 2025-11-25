export class Entity {

    globalEntityX
    globalEntityY
    hitbox
    png

    constructor(globalEntityX, globalEntityY, hitbox, png) {
    this.globalEntityX = globalEntityX
    this.globalEntityY = globalEntityY
    this.hitbox = hitbox
    this.png = png
    }

    checkCollision() { // wird in Subklassen implementiert   
    }

    draw() { // wird in Subklassen implementiert
    }

}