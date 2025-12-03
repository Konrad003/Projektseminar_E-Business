import { StaticEntity } from "./staticEntity.js"
export class DropSingleUse extends StaticEntity {

    constructor(globalEntityX, globalEntityY) {
        super(globalEntityX, globalEntityY)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
    }

    use() {   // kommt später 
        
    }
}

export class SpeedBoostDrop extends DropSingleUse {

    constructor(globalEntityX, globalEntityY) {
        super(globalEntityX, globalEntityY)
        this.duration = 10000 // 10 Sekunden Wirkung
        this.speedMultiplier = 2.0
    }

    use(player) {
        player.speed *= this.speedMultiplier

        setTimeout(() => {
            player.speed /= this.speedMultiplier
        }, this.duration)
    }
}