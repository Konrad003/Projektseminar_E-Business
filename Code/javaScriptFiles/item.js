export class Item {

    constructor(icon, description, level, playerStatKey) {
        this.icon = icon
        this.description = description
        this.level = 1
        this.playerStatKey = playerStatKey
    }

    lvlUp() {
        this.level++;
    }
}