//import { DropSingleUse } from "./dropSingleUse.js"
import { Enemy } from "./enemy.js"
//import { Entity } from "./entity.js"
//import { Equipment } from "./equipment.js"
//import { Item } from "./item.js"
import { Map } from "./map.js"
//import { Obstacles } from "./obstacles.js"
import { Player } from "./player.js"
//import { Projectile } from "./projectile.js"
//import { Projectile } from "./projectile.js"
//import { Weapon } from "./weapon.js";
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)
export class game {

    difficulty=1
    timesstamp
    upPressed
    downPressed
    leftPressed
    rightPressed
    constructor() {
        this.MapOne=null
        this.PlayerOne=null
    }

    start() {
        const timestamp = Date.now();
        this.MapOne = new Map(57,52,32,canvas.width, ctx)
        this.PlayerOne = new Player(canvas.width/2, canvas.height/2, 100, "png", 10, 32, 0, 0, 1, ctx)
        setInterval(Game.render.bind(this), 5)
        //setInterval(spawnEnemy, 100)

    }

    stop() {
        
    }

    resume() {
        
    }

    end() {
        
    }

    render() {
       
        this.MapOne.draw(this.PlayerOne.playerGlobalX, this.PlayerOne.playerGlobalY)
        this.PlayerOne.draw(canvas.width, canvas.height)
        //enemy.draw()
        
    }

    spawnEnemy() {
        enemy = new enemy(map.leftBorder, map.topBorder, 100, "a.png", 10, 5, 0, 5, false)
    }
    keyDownHandler(e) { // liest Input der Tastatur aus
        if ((e.key == "ArrowUp") || (e.key == 'w')) {
            this.upPressed = true;
        }
        if ((e.key == "ArrowLeft") || (e.key == 'a')) {
            this.leftPressed = true;
        }
        if ((e.key == "ArrowRight") || (e.key == 'd')) {
            this.rightPressed = true;
        }
        if ((e.key == "ArrowDown") || (e.key == 's')) {
            this.downPressed = true;
        }
    }

    keyUpHandler(e) { // liest Output der Tastatur aus
        if ((e.key == "ArrowUp") || (e.key == 'w')) {
            upPressed = false;
        }
        if ((e.key == "ArrowLeft") || (e.key == 'a')) {
            leftPressed = false;
        }
        if ((e.key == "ArrowRight") || (e.key == 'd')) {
            rightPressed = false;
        }
        if ((e.key == "ArrowDown") || (e.key == 's')) {
            downPressed = false;
        }
    }

    handleInput() {
        let dx = 0;
        let dy = 0;

        if (this.upPressed) dy -= 1;
        if (this.downPressed) dy += 1;
        if (this.leftPressed) dx -= 1;
        if (this.rightPressed) dx += 1;

        this.move(dx, dy, 1);
    }
}

const Game = new game()
Game.start()