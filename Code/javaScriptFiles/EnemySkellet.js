import {Enemy} from "./enemy.js"

export class EnemySkellet extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 35
        this.speed = 1
        this.png = "EnemySkellet"
        this.hitbox = {width: 10, height: 10}
        this.level = 1
        this.xpDrop = 2 
        this.baseDamage = 10
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
    }

    getColor() {
        return "white"
    }
}