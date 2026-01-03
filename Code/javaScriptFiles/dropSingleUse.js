import {StaticEntity} from "./staticEntity.js"

export class DropSingleUse extends StaticEntity {
    static enemyXpDrop = []
    static enemyItemDrop = []
    constructor(globalEntityX, globalEntityY, hitbox, png) {
        super(globalEntityX, globalEntityY, hitbox, png)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hitbox = hitbox
        this.png = png
        
    }

    apply(player) {
    //console.log("DropSingleUse picked up – noch kein Effekt definiert.")
    }
    drawEnemyItem(ctx, player, map) {
    for (const drop of DropSingleUse.enemyItemDrop) {
        let color = "pink"
        if (drop instanceof SpeedBoostDrop) {
            color = "orange"
        } else if (drop instanceof HealDrop) {
            color = "green"
        }
        drop.draw(ctx, player, color)
        }
    }
    
    drawEnemyXp(ctx, player, map) {
        for (const drop of DropSingleUse.enemyXpDrop) {
            drop.draw(ctx, player, "brown")
        }
    }

    handleEnemyItemPickups(player) {
        for (let i = DropSingleUse.enemyItemDrop.length - 1; i >= 0; i--) {
            const drop = DropSingleUse.enemyItemDrop[i]

            if (player.checkCollision(drop, 0, 0)) {
                player.collectPickup(drop)
                DropSingleUse.enemyItemDrop.splice(i, 1)  //aufgesammelte Item wird gelöscht
            }
        }
    }

    handleEnemyXpPickups(player) {
        for (let i = DropSingleUse.enemyXpDrop.length - 1; i >= 0; i--) {
            const drop = DropSingleUse.enemyXpDrop[i]

            if (player.checkCollision(drop, 0, 0)) {
               player.collectXp(2) // Jeder XP-Drop gibt 2 XP
               DropSingleUse.enemyXpDrop.splice(i, 1)  //aufgesammelte XP wird gelöscht
            }
        }
    }

    render(ctx, player, map){
        this.drawEnemyItem(ctx, player, map)
        this.drawEnemyXp(ctx, player, map)
        this.handleEnemyItemPickups(player)
        this.handleEnemyXpPickups(player)
    }
}

export class SpeedBoostDrop extends DropSingleUse {

    constructor(globalEntityX, globalEntityY, hitbox, png) {
        super(globalEntityX, globalEntityY, hitbox, png)
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

    constructor(globalEntityX, globalEntityY, hitbox, png) {
        super(globalEntityX, globalEntityY, hitbox, png)
        this.healAmount = 20 // z.B. 20 HP heilen
    }

    use(player) {
        if (this.used) {
            return
        }
        super.use(player)

        if (player == null) {
            return
        }
        // Falls maxHp existiert, daran begrenzen
        if (typeof player.maxHp === "number") {     //WTF von @Richard12434
            player.hp = Math.min(player.hp + this.healAmount, player.maxHp)
        } else {
            player.hp += this.healAmount
        }
    }
}