import {Enemy} from "../enemy.js"

export class EnemySensenmann extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY, weapon) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 100
        this.speed = 1
        this.png = "./Graphics/enemiesPNG/Sense/1.png"
        this.hitbox = {width: 634/9, height: 603/9}

        const img = new Image();
        img.src = this.png;

        this.level = 1
        this.xpDrop = 10
        this.baseDamage = 20
        this.oldMoveX = oldMoveX
        this.oldMoveY = oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
        this.ranged = false
        this.weapon = null  // wenn Waffen implementiert sind, durch weapon ersetzen
    }

    getColor() {
        return "silver"
    }
           updateStats() {
        if (this.level === this._currentStatsLevel) return;
        this.dmg += 8
        this.hp += 15
        this.speed += 0.05
    }
}