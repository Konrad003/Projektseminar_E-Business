//import { DropSingleUse } from "./dropSingleUse.js"
import { Enemy } from "/Code/javaScriptFiles/enemy.js"
import { Entity } from "/Code/javaScriptFiles/entity.js"
//import { Equipment } from "./equipment.js"
//import { Item } from "./item.js"
import { Map } from "/Code/javaScriptFiles/map.js"
//import { Obstacles } from "./obstacles.js"
import { Player } from "/Code/javaScriptFiles/player.js"
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
        if(this.PlayerOne.playerGlobalX >= 0 && this.PlayerOne.playerGlobalX <= this.MapOne.mapWidthTile * this.MapOne.tilelength &&
           this.PlayerOne.playerGlobalY >= 0 && this.PlayerOne.playerGlobalY <= this.MapOne.mapHightTile * this.MapOne.tilelength) {
            if (this.rightPressed) 
                this.PlayerOne.playerGlobalX += this.PlayerOne.speed;
            if (this.leftPressed) 
                this.PlayerOne.playerGlobalX -= this.PlayerOne.speed;
            if (this.upPressed) 
                this.PlayerOne.playerGlobalY -= this.PlayerOne.speed;
            if (this.downPressed) 
                this.PlayerOne.playerGlobalY += this.PlayerOne.speed;
        }else if(this.PlayerOne.playerGlobalX < 0 )
            this.PlayerOne.playerGlobalX = 0
        else if(this.PlayerOne.playerGlobalY < 0 )
            this.PlayerOne.playerGlobalY = 0
        else if(this.PlayerOne.playerGlobalX >= this.MapOne.mapWidthTile * this.MapOne.tilelength)
            this.PlayerOne.playerGlobalX = this.MapOne.mapWidthTile * this.MapOne.tilelength
        else if(this.PlayerOne.playerGlobalY >= this.MapOne.mapHightTile * this.MapOne.tilelength)
            this.PlayerOne.playerGlobalY = this.MapOne.mapHightTile * this.MapOne.tilelength
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

        this.MapOne = new Map(mwt, mht, tl, canvas.width, ctx, mapPixelWidth, mapPixelHeight)

        this.PlayerOne = new Player(this.screenX, this.screenY, 100, null, 1.5, 32, 0, 0, 1, ctx)

        setInterval(() => this.render(), 5);

        //setInterval(spawnEnemy, 100

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

        //enemy.draw()
    }

    spawnEnemy() {
        //Enemy = new enemy(map.leftBorder, map.topBorder, 100, "a.png", 10, 5, 0, 5, false)
    }





}


const Game = new game()
Game.start()
