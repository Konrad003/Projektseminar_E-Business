import {DropSingleUse, HealDrop, SpeedBoostDrop} from "./dropSingleUse.js"
import {Weapon} from "./weapon.js"
import {MovingEntity} from "./movingEntity.js"

export class Enemy extends MovingEntity {

   constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, level, xpDrop, elite, ranged = false) {
            super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
            // Nur Enemy-spezifische Felder nach Aufruf von super() setzen
            this.level = level
            this.xpDrop = xpDrop
            this.elite = elite
            this.globalEntityX = globalEntityX   // eigene Positionsvariable für Enemy
            this.globalEntityY = globalEntityY   // eigene Positionsvariable für Enemy
            this.ranged = ranged
            // Ranged-Enemy bekommt eine eigene Waffe
            this.weapon = this.ranged ? Weapon.create("basic") : null;

            if (this.weapon) {
            this.weapon.cooldown = 2000; // Gegner schießen langsamer als der Spieler (z.B. 800 ms)
            }

        }

    // Gegner zufällig am Kartenrand spawnen
    static spawnEnemyAtEdge(enemiesArray, mapWidth, mapHeight) {

        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
            case 0: // oben
                x = Math.random() * mapWidth - 1;   // spawnt Enemy an random Stelle am oberen Rand
                y = 1;
                break;

            case 1: // rechts
                x = mapWidth - 1;
                y = Math.random() * mapHeight - 1;
                break;

            case 2: // unten
                x = Math.random() * mapWidth - 1;
                y = mapHeight - 1;
                break;

            case 3: // links
                x = 1;
                y = Math.random() * mapHeight - 1;
                break;
        }

        // temporäre Werte, ohne lvl System bisher
        const hp = 20;
        const png = null;                 //KEIN enemyImg, damit kein Fehler
        const speed = 1.0;
        const hitbox = {width: 16, height: 16};
        const level = 1;
        const xpDrop = 2;
        const elite = false;

        const ranged = Math.random() < 0.3; // 30% Chance, dass dieser Enemy ein Ranged-Enemy ist

        enemiesArray.push(new Enemy(x, y, hp, png, speed, hitbox, level, xpDrop, elite, ranged));
    }

    // Gegner bewegt sich in Richtung Player
    chasePlayer(map, player, enemyArray = null) {

        let distanceX = player.globalEntityX - this.globalEntityX
        let distanceY = player.globalEntityY - this.globalEntityY

        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY) //Hypotenuse von Enemy zu Player berechnet distance
        if (distance <= 0) return //bleibt stehen bei distance = 0

        const stopDistance = 200 // Ranged-Enemy bleibt ab bestimmter Distanz stehen (z.B. 200px)
        if (this.ranged && distance <= stopDistance) {
            return
        }

        distanceX /= distance; // Teilt Entfernung durch sich selbst -> Gegner bewegt sich gleichmäßig
        distanceY /= distance;
        // NEU: Bewegungsschritt berechnen
        const moveStepX = distanceX * this.speed
        const moveStepY = distanceY * this.speed
        const visitedForX = new Set()
        const visitedForY = new Set()
        const resultX = this.attemptMoveAxis(this, 'x', moveStepX, enemyArray, map, visitedForX)
        const resultY = this.attemptMoveAxis(this, 'y', moveStepY, enemyArray, map, visitedForY)
    }

    die() {
        console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);

        const dropChance = 0.5 // Chance auf Drop - auf 50% zur besseren Visualisierung
        if (Math.random() < dropChance) {

            const roll = Math.random()

            if (roll < 0.33) {
                DropSingleUse.enemyItemDrop.push(
                new SpeedBoostDrop(this.globalEntityX, this.globalEntityY, {width:16, height:16}, null)
                )
            } else if (roll < 0.66) {
                DropSingleUse.enemyItemDrop.push(
                new HealDrop(this.globalEntityX, this.globalEntityY, {width: 16, height: 16}, null)
                )
            } else {
                DropSingleUse.enemyItemDrop.push(new DropSingleUse(this.globalEntityX, this.globalEntityY, {width: 16, height: 16}, null))
            }
        }

        DropSingleUse.enemyXpDrop.push(new DropSingleUse(this.globalEntityX, this.globalEntityY, {width: 8, height: 8}, null))
    }
    render(ctx, MapOne, PlayerOne, enemies, position){
        this.chasePlayer(MapOne, PlayerOne, enemies)                   // Gegner läuft auf den Spieler zu
        MapOne.drawMiniEnemy(this)
        if (PlayerOne.checkCollision(this, 0, 0)) {        // Treffer?
            PlayerOne.takeDmg(15)
            this.die()
            this.killCount++
            enemies.splice(position, 1)                       // aus dem Array entfernen → "Monster verschwinden"
        } else {
            this.draw(ctx,PlayerOne, this.ranged ? 'yellow' : 'red') // Gegner im Sichtbereich zeichnen
                    }
    }
}
