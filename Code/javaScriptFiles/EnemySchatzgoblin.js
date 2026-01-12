import {Enemy} from "./enemy.js"

export class EnemySchatzgoblin extends Enemy {
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile, oldMoveX, oldMoveY, blockedX, blockedY, weapon) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile)
        this.hp = 150
        this.speed = 0.5
        this.png = "EnemySchatzgoblin"
        this.hitbox = {width: 22, height: 22}
        this.level = 1
        this.xpDrop = 30
        this.baseDamage = 0
        this.oldMoveX=oldMoveX
        this.oldMoveY=oldMoveY
        this.blockedX = blockedX
        this.blockedY = blockedY
        this.ranged = false
        this.weapon = null  // wenn Waffen implementiert sind, durch weapon ersetzen

        this.radius = 64;
        this.centerX = globalEntityX;
        this.centerY = globalEntityY;
        // Startwinkel zufällig
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = 1.0 / 60.0; // Eine Umdrehung alle 6 Sekunden
        this.scared = false
        }

    move() {
        if (!this.scared) {
        this.angle += this.angularSpeed;
        this.globalEntityX = this.centerX + Math.cos(this.angle) * this.radius;
        this.globalEntityY = this.centerY + Math.sin(this.angle) * this.radius;
        } else {        
            this.chasePlayer(MapOne, PlayerOne, enemies)                   // Gegner läuft auf den Spieler zu
        }
        if (PlayerOne.globalEntityX) {}
    }

    render(ctx, MapOne, PlayerOne, enemies, projectiles, performanceNow, positionWithin, gridWidth){  
        let position=this.updateGridPlace(MapOne.tilelength, enemies, positionWithin, gridWidth)        
        this.draw(ctx, PlayerOne)
        this.move()
    }

    getColor() {
        return "DarkGreen"
    }
}