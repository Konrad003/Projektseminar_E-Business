import { StaticEntity } from "./staticEntity.js"
export class DropSingleUse extends StaticEntity {

        constructor(globalEntityX, globalEntityY) {
        const hitbox = { width: 13, height: 13 }
        const png = null

        super(globalEntityX, globalEntityY, hitbox, png)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hitbox = hitbox   
        this.png = png
    }

    apply(player) {
        console.log("DropSingleUse picked up – noch kein Effekt definiert.")
    }
    
}

export class SpeedBoostDrop extends DropSingleUse {

    constructor(globalEntityX, globalEntityY) {
        super(globalEntityX, globalEntityY)
        this.duration = 10000 // 10 Sekunden Wirkung
        this.speedMultiplier = 5.0
    }

    apply(player) {

    // Basis-Speed merken (falls noch nicht gesetzt)
    if (player.baseSpeed == null) {
        player.baseSpeed = player.speed
    }

    // Falls schon ein Speedboost aktiv → NUR Timer resetten
    if (player.speedBoostTimeout) {
        clearTimeout(player.speedBoostTimeout)
    } else {
        // nur erhöhen wenn neu aktiviert
        player.speed = player.baseSpeed * this.speedMultiplier
    }

    // Effekt-Dauer resetten
    player.speedBoostTimeout = setTimeout(() => {
        player.speed = player.baseSpeed
        player.speedBoostTimeout = null
    }, this.duration)
}
}

    export class HealDrop extends DropSingleUse {

    constructor(globalEntityX, globalEntityY) {
        super(globalEntityX, globalEntityY)
        this.healAmount = 20 // z.B. 20 HP heilen
    }

    use(player) {
        if (this.used) return
        super.use(player)

        if (player == null) return

        // Falls maxHp existiert, daran begrenzen
        if (typeof player.maxHp === "number") {
            player.hp = Math.min(player.hp + this.healAmount, player.maxHp)
        } else {
            player.hp += this.healAmount
        }
    }
}