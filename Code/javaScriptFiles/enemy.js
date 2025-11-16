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
        if (distance <= 0) return //bleibt stehen bei distance = 0

        dx /= distance; // Teilt Entfernung durch sich selbst -> Gegner bewegt sich gleichmäßig
        dy /= distance;

        this.globalX+= dx * this.speed //Gegner läuft in Richtung des Players
        this.globalY+= dy * this.speed
        
    }

    draw(ctx) {
    if (!this.png) return;

    ctx.drawImage(this.png, drawX, drawY, this.hitbox.width, this.hitbox.height);
    }

    die() {
    console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);
    }
}

function spawnEnemyAtEdge(mapWidth, mapHeight) {

    const side = Math.floor(Math.random() * 4); 
    let x, y;

    switch (side) {
        case 0: // oben
            x = Math.random() * mapWidth;   // spawnt Enemy an random Stelle am oberen Rand
            y = 0;
            break;

        case 1: // rechts
            x = mapWidth;
            y = Math.random() * mapHeight;
            break;

        case 2: // unten
            x = Math.random() * mapWidth;
            y = mapHeight;
            break;

        case 3: // links
            x = 0;
            y = Math.random() * mapHeight;
            break;
    }

    // temporäre Werte, ohne lvl System bisher
    const hp = 10;
    const png = enemyImg;         
    const speed = 0.5;            
    const hitbox = { width: 10, height: 20 };
    const level = 1;
    const xpDrop = 2;
    const elite = false;

    return new Enemy(x, y, hp, png, speed, hitbox, level, xpDrop, elite);
}