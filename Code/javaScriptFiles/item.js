import { StaticEntity } from "./staticEntity.js"
export class Item extends StaticEntity {

    constructor(globalX, globalY, hitbox, png, icon, description) {
        super(globalX, globalY, hitbox, png)
        this.globalX = globalX
        this.globalY = globalY
        this.hitbox = hitbox
        this.png = png
        this.icon = icon
        this.description = description
    }
}