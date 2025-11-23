//import { DropSingleUse } from "./dropSingleUse.js"
import { Enemy, checkPlayerEnemyCollision} from "/Code/javaScriptFiles/enemy.js" // spawnEnemyAtEdge zusätzlich importiert
// import { Entity } from "/Code/javaScriptFiles/entity.js"
//import { Equipment } from "./equipment.js"
//import { Item } from "./item.js"
import { Map } from "./map.js"
//import { Obstacles } from "./obstacles.js"
import { Player } from "./player.js"
//import { Projectile } from "./projectile.js"
//import { Weapon } from "./weapon.js";

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

export class game {



    difficulty=1
    timestamp
    upPressed = false
    downPressed = false
    leftPressed = false
    rightPressed = false

    constructor() {
        this.MapOne = null
        this.PlayerOne = null
        this.enemies = []   // CHANGE: Array für alle aktiven Gegner
    }

    keyDownHandler(e) { // liest Input der Tastatur aus
        if ((e.key === "ArrowUp") || (e.key === 'w')) {
            this.upPressed = true;
        }
        if ((e.key === "ArrowLeft") || (e.key === 'a')) {
            this.leftPressed = true;
        }
        if ((e.key === "ArrowRight") || (e.key === 'd')) {
            this.rightPressed = true;
        }
        if ((e.key === "ArrowDown") || (e.key === 's')) {
            this.downPressed = true;
        }
    }

    keyUpHandler(e) { // liest Output der Tastatur aus
        if ((e.key === "ArrowUp") || (e.key === 'w')) {
            this.upPressed = false;
        }
        if ((e.key === "ArrowLeft") || (e.key === 'a')) {
            this.leftPressed = false;
        }
        if ((e.key === "ArrowRight") || (e.key === 'd')) {
            this.rightPressed = false;
        }
        if ((e.key === "ArrowDown") || (e.key === 's')) {
            this.downPressed = false;
        }
    }

    handleInput() {
        let mapLength=this.MapOne.mapWidthTile * this.MapOne.tilelength
        let mapHeight=this.MapOne.mapHeightTile * this.MapOne.tilelength
            if (this.rightPressed && this.PlayerOne.playerGlobalX <= mapLength) 
                this.PlayerOne.playerGlobalX += this.PlayerOne.speed
            if (this.leftPressed && this.PlayerOne.playerGlobalX >= 0) 
                this.PlayerOne.playerGlobalX -= this.PlayerOne.speed
            if (this.upPressed && this.PlayerOne.playerGlobalY >= 0) {
                this.PlayerOne.playerGlobalY -= this.PlayerOne.speed
                if (this.leftPressed != this.rightPressed && !(this.downPressed)){      // smoothe diagonale bewegung hoch
                    if (this.leftPressed){ 
                        this.PlayerOne.playerGlobalX += this.PlayerOne.speed/3
                        this.PlayerOne.playerGlobalY += this.PlayerOne.speed/3
                    }
                    if (this.rightPressed){
                        this.PlayerOne.playerGlobalX -= this.PlayerOne.speed/3
                        this.PlayerOne.playerGlobalY += this.PlayerOne.speed/3
                    }
                }
            }
            if (this.downPressed && this.PlayerOne.playerGlobalY <= mapHeight){         // smoothe diagonale bewegung runter
                this.PlayerOne.playerGlobalY += this.PlayerOne.speed
                if (this.leftPressed != this.rightPressed && !(this.upPressed)){
                    if (this.leftPressed){ 
                        this.PlayerOne.playerGlobalX += this.PlayerOne.speed/3
                        this.PlayerOne.playerGlobalY -= this.PlayerOne.speed/3
                    }
                    if (this.rightPressed){
                        this.PlayerOne.playerGlobalX -= this.PlayerOne.speed/3
                        this.PlayerOne.playerGlobalY -= this.PlayerOne.speed/3
                    }
                }
            }
    }

    start() {
        const timestamp = Date.now();
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        document.addEventListener("keyup", this.keyUpHandler.bind(this));

        let mwt = 57; //mapWithTiles for creating the map
        let mht = 52; //mapHeightTiles for creating the map
        let tl = 32; //tileLength for creating the map

        const mapPixelWidth = mwt * tl
        const mapPixelHeight = mht * tl

        const playerHitbox = 32;

        this.screenX = Math.floor(canvas.width / 2 - playerHitbox / 2);
        this.screenY = Math.floor(canvas.height / 2 - playerHitbox / 2);

        this.MapOne = new Map(mwt, mht, tl, canvas.width, ctx)

        this.PlayerOne = new Player(this.screenX, this.screenY, 100, null, 1.5, 32, 0, 0, 1, ctx)

        setInterval(() => this.render(), 5);

        setInterval(() => Enemy.spawnEnemyAtEdge(this.enemies, this.MapOne.mapWidthTile * this.MapOne.tilelength,this.MapOne.mapHeightTile * this.MapOne.tilelength), 2000); // CHANGE: Gegner werden alle 2 Sekunden gespawnt
    }

    stop() {
        
    }

    resume() {
        
    }

    end() {
        //myLife();
    }

    render() {
        this.handleInput()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.MapOne.draw(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY)
        this.PlayerOne.drawPlayer(canvas.width/2, canvas.height/2, this.PlayerOne.hitbox, this.PlayerOne.hitbox, 'blue')

        // Gegner bewegen, zeichnen und bei Collision entfernen
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i]

            enemy.chasePlayer(this.PlayerOne)                   // Gegner läuft auf den Spieler zu

            if (checkPlayerEnemyCollision(this.PlayerOne, enemy)) {        // Treffer?
                enemy.die()
                this.enemies.splice(i, 1)                       // aus dem Array entfernen → "Monster verschwinden"
            } else {
                enemy.draw(ctx, this.MapOne.leftBorder, this.MapOne.topBorder) // Gegner im Sichtbereich zeichnen
            }
        }
    }
}


const Game = new game()
Game.start()