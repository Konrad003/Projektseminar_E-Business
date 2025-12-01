import { StaticEntity } from "./staticEntity.js"
export class Obstacle extends StaticEntity {

    constructor(globalEntityX, globalEntityY, hitbox, png) {
    super(globalEntityX, globalEntityY, hitbox, png)
    this.globalEntityX = globalEntityX
    this.globalEntityY = globalEntityY
    this.hitbox = hitbox
    this.png = png
    }
}