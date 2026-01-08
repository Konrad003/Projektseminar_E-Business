import {Enemy} from "./enemy.js"

export class EnemyHexe extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 75
        this.speed = 0.8
        this.png = "EnemyHexe"
        this.hitbox = {width: 10, height: 10}
        this.level = 1
        this.xpDrop = 4
        this.baseDamage = 20
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
    }

    getColor() {
        return "purple"
    }
}