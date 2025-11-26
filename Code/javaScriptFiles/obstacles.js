import { StaticEntity } from "./staticEntity.js"
export class Obstacles extends StaticEntity {

    constructor(globalX, globalY, hitbox, png) {
    super(globalX, globalY, hitbox, png)
    this.globalX = globalX
    this.globalY = globalY
    this.hitbox = hitbox
    this.png = png
    }
}