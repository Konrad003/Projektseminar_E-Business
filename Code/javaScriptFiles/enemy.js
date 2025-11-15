class Enemy extends Entity {
    
    constructor(globalX, globalY, hp, png, speed, hitbox, level, xpDrop, elite){
        super(globalX, globalY, hp, png, speed, hitbox)
        this.level = level
        this.xpDrop = xpDrop
        this.elite = elite
    }

    chasePlayer(player) {
        let dx = player.globalX - this.globalX
        let dy = player.globalY - this.globalY

        let distance = Math.sqrt(dx*dx+dy*dy) //Hypotenuse von Enemy zu Player berechnet distance
        if (distance === 0) return //bleibt bei distance = 0 stehen

        this.globalX+= dx * this.speed //Gegner läuft in Richtung des Players
        this.globalY+= dy * this.speed
        
    }

    draw(ctx) {
    if (!this.png) return;

    const drawX = this.globalX - this.hitbox.width / 2;
    const drawY = this.globalY - this.hitbox.height / 2;

    ctx.drawImage(this.png, drawX, drawY, this.hitbox.width, this.hitbox.height);
}

    die() {
    console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);
    }
}