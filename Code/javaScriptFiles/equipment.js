class Equipment extends Item{

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
    
    apply() {

    }
}