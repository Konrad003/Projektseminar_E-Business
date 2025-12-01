class Weapon extends Item {
    dmg
    cooldown
    focus
    splash
    range
    lvl
    amount

    constructor(icon, description, picture, dmg, cooldown, focus, splash, range, lvl, amount) {
        super(icon, description, picture)
        this.dmg = dmg
        this.cooldown = cooldown
        this.focus = focus
        this.splash = splash
        this.range = range
        this.lvl = lvl
        this.amount = amount
    }

    shoot() {
        
    }
}