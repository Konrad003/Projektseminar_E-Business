import {DropSingleUse, HealDrop, SpeedBoostDrop} from "./dropSingleUse.js"
import {Weapon} from "./weapon.js"
import {MovingEntity} from "./movingEntity.js"


export class Enemy extends MovingEntity {

   constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, gridMapTile) {
            super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
            this.gridMapTile = gridMapTile
            this.oldMoveX=0
            this.oldMoveY=0
            this.blockedX = false
            this.blockedY = false
        }

    static createRandomEnemy(globalX, globalY, gridTile) {  // muss statisch sein, da sie vor der Instanziierung eines Enemys aufgerufen wird
        const enemyTypes = {
            slime: EnemySlime,
            reiter: EnemyReiter,
            sensenmann: EnemySensenmann,
            hexe: EnemyHexe,
            schatzgoblin: EnemySchatzgoblin,
            gepanzerterRitter: EnemyGepanzerterRitter,
            skellet: EnemySkellet
            };
        const keys = Object.keys(enemyTypes);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const EnemyClass = enemyTypes[randomKey];

        return new EnemyClass(globalEntityX,globalEntityY,hp, png,speed,hitbox ,gridMapTile ,oldMoveX ,oldMoveY ,blockedX ,blockedY);
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
        if (x<0)x=0
        if (y<0)y=0 // Können außerhalb der Map spawnen, FIXEN
                    // falls x / y > Map spawnen sie da trotzdem

        let gridMapTile = {column : Math.floor(x / (gridWidth*tilewidth)), row : Math.floor(y / (gridWidth*tilewidth))}
        
        enemiesArray[gridMapTile.row][gridMapTile.column].within.push(Enemy.createRandomEnemy(x, y, gridMapTile));
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

        const visitedForX = new Set()
        const visitedForY = new Set()

        

        let oldX = this.globalEntityX
        let oldY = this.globalEntityY

        distanceX /= distance; // Teilt Entfernung durch sich selbst -> Gegner bewegt sich gleichmäßig
        distanceY /= distance;

        let moveStepX = distanceX * this.speed
        let moveStepY = distanceY * this.speed 

        let resultX
        let resultY
        if (!this.blockedX && !this.blockedY){                                      // Bewegung wenn alles frei ist
            resultX = this.attemptMoveAxis(this, 'x', moveStepX, enemyArray, map, visitedForX).success
            resultY = this.attemptMoveAxis(this, 'y', moveStepY, enemyArray, map, visitedForY).success
            if (!resultX){
                this.blockedX = true 
                this.oldMoveY = Math.sign(moveStepY) * this.speed
            }
            if (!resultY){
                this.blockedY = true
                this.oldMoveX = Math.sign(moveStepX) * this.speed
            }


        }else{                                                                         //Bewegung wenn mind eine Achse blockiert ist
            if (this.blockedX && this.blockedY){
                console.log("2")
                if(Math.random()<0.5) moveStepX*= -1
                else moveStepY*=-1 
            }
            if (this.blockedX){                                                         //Bewegung wenn X Achse Blockiert ist
                resultX = this.attemptMoveAxis(this, 'x', moveStepX, enemyArray, map, visitedForX).success        //Versuchen zu Bewegen auf der X-Achse
                resultY = this.attemptMoveAxis(this, 'y', this.oldMoveY, enemyArray, map, visitedForY).success   // gesamte Bewegung auf der Y-Achse
                
                if (resultX){        //Falls auch X-Achse nun nicht mehr Blockiert ist
                    this.blockedX = false
                }
                if (!resultY){        //Falls Y-Achse nun auch blockiert
                    this.blockedY = true
                    this.oldMoveX = Math.sign(moveStepX) * this.speed
                }
            }
            
            visitedForX.clear()
            visitedForY.clear()

            if (this.blockedY){
                resultX = this.attemptMoveAxis(this, 'x', this.oldMoveX, enemyArray, map, visitedForX).success
                resultY = this.attemptMoveAxis(this, 'y', moveStepY, enemyArray, map, visitedForY).success
                if (resultY){    
                    this.blockedY = false
                }
                if (!resultX){
                    this.blockedX = true 
                    this.oldMoveY = Math.sign(moveStepY) * this.speed                   
                }
            }
        }
    }

    
    die(enemies, positionWithin) {
        //console.log("Enemy ist gestorben! XP gedroppt:", this.xpDrop);
        enemies[this.gridMapTile.row][this.gridMapTile.column].within.splice(positionWithin, 1)
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
     
    render(ctx, MapOne, PlayerOne, enemies, projectiles, performanceNow, positionWithin, gridWidth){
        let position=this.updateGridPlace(MapOne.tilelength, enemies, positionWithin, gridWidth)
        this.chasePlayer(MapOne, PlayerOne, enemies)                   // Gegner läuft auf den Spieler zu
        if (this.ranged)  this.weapon.render(ctx, PlayerOne, performanceNow, enemies, MapOne, gridWidth)
        if (PlayerOne.checkCollision(this, 0, 0)) {        // Treffer?
            PlayerOne.takeDmg(15, enemies, positionWithin)
            this.killCount++
        } else {
            this.draw(ctx, PlayerOne, this.ranged ? 'yellow' : 'red') // Gegner im Sichtbereich zeichnen
        }
    }
}
