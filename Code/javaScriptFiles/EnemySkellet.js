import {Enemy} from "./enemy.js"
import { Weapon } from "./weapon-refactored-v2.js"

export class EnemySkellet extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY, weapon) {
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
        this.weapon = Weapon.create("basicEnemy", this, 420, 420, 8)    // wenn Waffen implemtiert sind, durch weapon ersetzen
        this.ranged = true
    }

    getColor() {
        return "white"
    }
}