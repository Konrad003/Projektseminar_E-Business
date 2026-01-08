import {Enemy} from "./enemy.js"

export class EnemySchatzgoblin extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 150
        this.speed = 2
        this.png = "EnemySchatzgoblin"
        this.hitbox = {width: 22, height: 2}
        this.level = 1
        this.xpDrop = 30
        this.baseDamage = 0
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
    }

    getColor() {
        return "DarkGreen"
    }
}