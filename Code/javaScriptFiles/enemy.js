import {DropSingleUse, HealDrop, SpeedBoostDrop} from "./dropSingleUse.js"
import {Weapon} from "./weapon.js"
import {MovingEntity} from "./movingEntity.js"

export class Enemy extends MovingEntity {

   constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, level, xpDrop, elite, ranged = false, gridMapTile) {
            super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
            // Nur Enemy-spezifische Felder nach Aufruf von super() setzen
            this.level = level
            this.xpDrop = xpDrop
            this.elite = elite
            this.globalEntityX = globalEntityX   // eigene Positionsvariable für Enemy
            this.globalEntityY = globalEntityY   // eigene Positionsvariable für Enemy
            this.ranged = ranged
            this.gridMapTile = gridMapTile
            // Ranged-Enemy bekommt eine eigene Waffe
            this.weapon = this.ranged ? Weapon.create("basic") : null;

            if (this.weapon) {
            this.weapon.cooldown = 2000; // Gegner schießen langsamer als der Spieler (z.B. 800 ms)
            }

            
        }

    // Gegner zufällig am Kartenrand spawnen
    static spawnEnemyOutsideView(enemiesArray, player, canvas, tilewidth, gridWidth) {

        const offset = 80
        const side = Math.floor(Math.random() * 4)

        const left = player.globalEntityX - canvas.width / 2
        const right = player.globalEntityX + canvas.width / 2
        const top = player.globalEntityY - canvas.height / 2
        const bottom = player.globalEntityY + canvas.height / 2

        let x, y

        switch (side) {
            case 0: // oben
                x = left + Math.random() * (right - left)
                y = top - offset
                break

            case 1: // rechts
                x = right + offset
                y = top + Math.random() * (bottom - top)
                break

            case 2: // unten
                x = left + Math.random() * (right - left)
                y = bottom + offset
                break

            case 3: // links
                x = left - offset
                y = top + Math.random() * (bottom - top)
                break
        }
        let gridMapTile = {column : Math.floor(x / (gridWidth*tilewidth)), row : Math.floor(y / (gridWidth*tilewidth))}
        // temporäre Werte, ohne lvl System bisher
        const hp = 20;
        const png = null;                 //KEIN enemyImg, damit kein Fehler
        const speed = 1.0;
        const hitbox = {width: 16, height: 16};
        const level = 1;
        const xpDrop = 2;
        const elite = false;
        const ranged = Math.random() < 0.3; // 30% Chance, dass dieser Enemy ein Ranged-Enemy ist

        enemiesArray[gridMapTile.row][gridMapTile.column].within.push(new Enemy(x, y, hp, png, speed, hitbox, level, xpDrop, elite, ranged, gridMapTile));
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
        //console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);

        const dropChance = 0.5 // Chance auf Drop - auf 50% zur besseren Visualisierung
        if (Math.random() < dropChance) {

            const roll = Math.random()

            if (roll < 0.33) {
                DropSingleUse.enemyItemDrop.push(new SpeedBoostDrop(this.globalEntityX, this.globalEntityY, {
                    width: 16,
                    height: 16
                }, null))
            } else if (roll < 0.66) {
                DropSingleUse.enemyItemDrop.push(new HealDrop(this.globalEntityX, this.globalEntityY, {
                    width: 16,
                    height: 16
                }, null))
            } else {
                DropSingleUse.enemyItemDrop.push(new DropSingleUse(this.globalEntityX, this.globalEntityY, {
                    width: 16,
                    height: 16
                }, null))
            }
        }

        Game.killCount++
        DropSingleUse.enemyXpDrop.push(new DropSingleUse(this.globalEntityX, this.globalEntityY, {
            width: 8,
            height: 8
        }, null))
    }

    shouldShoot(player) {
        // Nur Ranged-Gegner mit Waffe können schießen
        if (!this.ranged || !this.weapon) return false;

        // Distanzberechnung mit deinen Bezeichnern
        let distanceX = player.globalEntityX - this.globalEntityX;
        let distanceY = player.globalEntityY - this.globalEntityY;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Nutze die Eigenschaft oder fallback auf den bisherigen Wert
        let stopDistance = 200;

        return distance <= stopDistance;
    }
     
    render(ctx, MapOne, PlayerOne, enemies, projectiles, positionWithin, gridWidth){  
        let position=this.updateGridPlace(MapOne.tilelength, enemies, positionWithin, gridWidth)
        this.chasePlayer(MapOne, PlayerOne, enemies)                   // Gegner läuft auf den Spieler zu
        if (this.shouldShoot(PlayerOne)) { //prüft ob gegner nah genug ist zum schießen
                this.weapon.shoot(
                this,                 // shooter = der Gegner
                projectiles,      // gemeinsames Projektil-Array
                performance.now(),     // für cooldown
                enemies,          // enemies-Liste (wird hier nicht genutzt, da targetEntity gesetzt)
                PlayerOne,        // targetEntity = Spieler
                true                   // isEnemyShooter = feindliches Projektil (trifft Player)
                )
            }
        MapOne.drawMiniEnemy(this)
        if (PlayerOne.checkCollision(this, 0, 0)) {        // Treffer?
            PlayerOne.takeDmg(15)
            this.die()
            this.killCount++
            enemies[position.gridMapTile.row][position.gridMapTile.column].within.splice(position.positionWithin, 1)                       // aus dem Array entfernen → "Monster verschwinden"
        } else {
            this.draw(ctx, PlayerOne, this.ranged ? 'yellow' : 'red') // Gegner im Sichtbereich zeichnen
        }
    }
}
