import { entity } from "./entity.js";
export class player extends entity {
    xp
    level
    ausrüstung = []
    weapons = []
    regeneration
    //usw.

    constructor(globalX, globalY, hp, png, speed, hitbox, ausrüstung, weapons, regeneration /*usw. */) {
        super(globalX, globalY, hp, png, speed, hitbox)
        this.ausrüstung = ausrüstung
        this.weapons = weapons
        this.regeneration = regeneration
    }

    handleInput() {

    }

    lvlUp() {

    }

    die() {

    }

    collectPickup() {

    }
}