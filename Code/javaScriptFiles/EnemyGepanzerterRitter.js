import {Enemy} from "./enemy.js"

export class EnemyGepanzerterRitter extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 500
        this.speed = 0.5
        this.png = "EnemyGepanzerterRitter"
        this.hitbox = {width: 26, height: 26}
        this.level = 1
        this.xpDrop = 25
        this.baseDamage = 40
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
    }

    getColor() {
        return "black"
    }
}