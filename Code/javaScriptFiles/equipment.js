import {Item} from "./item.js"

export class Equipment extends Item {

    static dashActive = true //Gibt an ob der Spieler Dash freigeschaltet hat
    attackBonus
    defenseBonus
    xpBonus
    projectileSize

    //usw.

    constructor(icon, description, picture, attackBonus, defenseBonus, xpBonus, projectileSize /*usw.*/) {
        super(icon, description, picture)
        this.attackBonus = attackBonus
        this.defenseBonus = defenseBonus
        this.xpBonus = xpBonus
        this.projectileSize = projectileSize
        //usw.
    }

    //static um zu testen. Ansonsten funktional, aber noch nicht komplett wie gewünscht!!
    static dashAction(player, map, inputState) {
        if (this.dashActive) {
            for (let d = 0; d <= 10; d++) {
                let dashDistance = 10
                console.log(dashDistance)
                if (inputState.rightPressed) {
                    player.globalEntityX = map.rightFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
                }
                if (inputState.upPressed) {
                    player.globalEntityY = map.topFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
                }
                if (inputState.leftPressed) {
                    player.globalEntityX = map.leftFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
                }
                if (inputState.downPressed) {
                    player.globalEntityY = map.downFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
                }
            }
        }

    }

    dashLevelUp() {

    }

}