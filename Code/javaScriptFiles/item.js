import { StaticEntity } from "./staticEntity.js"
export class Item extends StaticEntity {

    constructor(globalEntityX, globalEntityY, hitbox, png, icon, description) {
        super(globalEntityX, globalEntityY, hitbox, png)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hitbox = hitbox
        this.png = png
        this.icon = icon
        this.description = description
    }
}