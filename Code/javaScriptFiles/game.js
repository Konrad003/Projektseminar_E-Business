//import { DropSingleUse } from "./dropSingleUse.js"
import {Enemy, checkPlayerEnemyCollision, drawEnemyItem} from "./enemy.js" // spawnEnemyAtEdge zusätzlich importiert
//import { Entity } from "./entity.js"
//import { Equipment } from "./equipment.js"
//import { Item } from "./item.js"
import {Map} from "./map.js"
//import { Obstacles } from "./obstacles.js"
import {Player} from "./player.js"
//import { Projectile } from "./projectile.js"
//import { Weapon } from "./weapon.js";

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

export class game {


    difficulty = 1
    timestamp
    upPressed = false
    downPressed = false
    leftPressed = false
    rightPressed = false
    mapData

    constructor() {
        this.MapOne = null
        this.PlayerOne = null
        this.enemies = [] // Array für alle aktiven Gegner
    }

    loadMap(file) {
        return fetch(file)
            .then(response => response.json())
            .then(jsondata => {
                this.mapData.push(jsondata); // JSON als ein Element im Array speichern
            })
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
    let mapLength = this.MapOne.mapWidthTile * this.MapOne.tilelength - this.MapOne.tilelength
    let mapHeight = this.MapOne.mapHeightTile * this.MapOne.tilelength - this.MapOne.tilelength
    let mapTileNW = this.MapOne.findTile(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY)
    let mapTileNO = this.MapOne.findTile(this.PlayerOne.playerGlobalX  + this.MapOne.tilelength, this.PlayerOne.playerGlobalY)
    let mapTileSO = this.MapOne.findTile(this.PlayerOne.playerGlobalX + this.MapOne.tilelength, this.PlayerOne.playerGlobalY  + this.MapOne.tilelength)
    let mapTileSW = this.MapOne.findTile(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY  + this.MapOne.tilelength)
    if (this.rightPressed)  this.PlayerOne.playerGlobalX = this.MapOne.rightFree(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY, this.PlayerOne.speed)
    if (this.upPressed)  this.PlayerOne.playerGlobalY = this.MapOne.topFree(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY, this.PlayerOne.speed)
    if (this.leftPressed)  this.PlayerOne.playerGlobalX = this.MapOne.leftFree(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY, this.PlayerOne.speed)
    if (this.downPressed)  this.PlayerOne.playerGlobalY = this.MapOne.downFree(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY, this.PlayerOne.speed)
    }   

    start() {
        const timestamp = Date.now();
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        document.addEventListener("keyup", this.keyUpHandler.bind(this));


        this.mapData = []
        this.loadMap("./Code/Tiled/Map1.json").then(() => {
            this.mapData = this.mapData[0];
            //console.log(this.mapData.layers[0].data)
            //this.mapDataTiles = this.mapData.layers[0].data

            this.MapOne = new Map(this.mapData, canvas.width, ctx)
            this.PlayerOne = new Player(this.mapData.width * this.mapData.tilewidth / 2, this.mapData.height * this.mapData.tilewidth / 2, 100, null, 1.0, 32, 0, 0, 1, ctx)
            setInterval(() => this.render(), 5);
        });


        //setInterval(spawnEnemy, 100

        setInterval(() => Enemy.spawnEnemyAtEdge(this.enemies, this.mapData.width * this.mapData.tilewidth, this.mapData.height * this.mapData.tilewidth), 2000); // CHANGE: Gegner werden alle 2 Sekunden gespawnt
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
        this.PlayerOne.drawPlayer(canvas.width / 2, canvas.height / 2, this.PlayerOne.hitbox, this.PlayerOne.hitbox, 'blue')

        // Gegner bewegen, zeichnen und bei Collision entfernen
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i]

            enemy.chasePlayer(this.PlayerOne)                   // Gegner läuft auf den Spieler zu

            if (checkPlayerEnemyCollision(this.PlayerOne, enemy)) {        // Treffer?
                enemy.die()
                this.enemies.splice(i, 1)                       // aus dem Array entfernen → "Monster verschwinden"
            } else {
                let leftBorder = this.PlayerOne.playerGlobalX - this.MapOne.FOV / 2
                let topBorder = this.PlayerOne.playerGlobalY - this.MapOne.FOV / 2
                enemy.draw(ctx, leftBorder, topBorder) // Gegner im Sichtbereich zeichnen
            }
        }

        drawEnemyItem(ctx, this.PlayerOne, this.MapOne)
    }
}


const Game = new game()
Game.start()
