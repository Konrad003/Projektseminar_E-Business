import {Enemy} from "./enemy.js"

export class EnemyReiter extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 80
        this.speed = 2.5
        this.png = "EnemyReiter"
        this.hitbox = {width: 12, height: 12}
        this.level = 1
        this.xpDrop = 2
        this.baseDamage = 15
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
    }
    getColor() {
        return "grey"
    }
}