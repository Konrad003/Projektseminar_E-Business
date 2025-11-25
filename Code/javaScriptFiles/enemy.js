import { Entity } from "./entity.js"
export class Enemy extends Entity {
    
    constructor(globalX, globalY, hp, png, speed, hitbox, level, xpDrop, elite, ranged = false){ 
        super(globalX, globalY, hp, png, speed, hitbox)
        this.level = level
        this.xpDrop = xpDrop
        this.elite = elite
        this.enemyX = globalX   // eigene Positionsvariable für Enemy
        this.enemyY = globalY   // eigene Positionsvariable für Enemy
        this.ranged = ranged    
    }

    // Gegner zufällig am Kartenrand spawnen
    static spawnEnemyAtEdge(enemiesArray, mapWidth, mapHeight) {

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
        const png = null;                 //KEIN enemyImg, damit kein Fehler
        const speed = 1.0;            
        const hitbox = { width: 32, height: 32 };  
        const level = 1;
        const xpDrop = 2;
        const elite = false;

        const ranged = Math.random() < 0.3; // 30% Chance, dass dieser Enemy ein Ranged-Enemy ist

        enemiesArray.push(new Enemy(x, y, hp, png, speed, hitbox, level, xpDrop, elite, ranged));  
    }

    // Gegner bewegt sich in Richtung Player
    chasePlayer(player) {
        
        let distanceX = player.playerGlobalX - this.enemyX
        let distanceY = player.playerGlobalY - this.enemyY

        let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY) //Hypotenuse von Enemy zu Player berechnet distance
        if (distance <= 0) return //bleibt stehen bei distance = 0

        const stopDistance = 200 // Ranged-Enemy bleibt ab bestimmter Distanz stehen (z.B. 200px)
        if (this.ranged && distance <= stopDistance) {
            return
        }

        distanceX /= distance; // Teilt Entfernung durch sich selbst -> Gegner bewegt sich gleichmäßig
        distanceY /= distance;

        this.enemyX += distanceX * this.speed //Gegner läuft in Richtung des Players
        this.enemyY += distanceY * this.speed
    }

    // Gegner als Rechteck im Sichtfeld zeichnen
    draw(ctx, mapLeftBorder, mapTopBorder) {
        const screenX = this.enemyX - mapLeftBorder
        const screenY = this.enemyY - mapTopBorder

        ctx.fillStyle = this.ranged ? "yellow" : "red"
        ctx.fillRect(screenX, screenY, this.hitbox.width, this.hitbox.height)
    }

    die() {
        console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);
    }
}

//einfache AABB-Kollision zwischen Spieler und einem Enemy
export function checkPlayerEnemyCollision(player, enemy) {
    const pLeft = player.playerGlobalX;
    const pTop = player.playerGlobalY;
    const pRight = pLeft + player.hitbox;
    const pBottom = pTop + player.hitbox;

    const eLeft = enemy.enemyX;
    const eTop = enemy.enemyY;
    const eRight = eLeft + enemy.hitbox.width;
    const eBottom = eTop + enemy.hitbox.height;

    if (pRight < eLeft) return false
    if (pLeft > eRight) return false
    if (pBottom < eTop) return false
    if (pTop > eBottom) return false

    return true
}
