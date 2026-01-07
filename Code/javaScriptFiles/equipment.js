import {Item} from "./item.js"

class Equipment extends Item {

    dashActive = false //Gibt an ob der Spieler Dash freigeschaltet hat
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

    //Funktional, aber noch nicht komplett wie gewünscht!!
    dashAction(player, map, inputState) {
        if (this.dashActive) {
            for (let d = 0; d <= 10; d++) {
                let dashDistance = 10
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

export default Equipment