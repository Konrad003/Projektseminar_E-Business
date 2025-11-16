//import { dropSingleUse } from "./dropSingleUse.js"
//import { enemy } from "./enemy.js"
//import { entity } from "./entity.js"
//import { equipment } from "./equipment.js"
//import { item } from "./item.js"
import { map } from "./map.js"
//import { obstacles } from "./obstacles.js"
import { player } from "./player.js"
//import { projectile } from "./projectile.js"
//import { projectile } from "./projectile.js"
//import { weapon } from "./weapon.js";
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

export class game {
    difficulty=1
    timesstamp

    constructor() {
        this.MapOne=null
        this.PlayerOne=null
    }

    start() {
        const timestamp = Date.now();
        this.MapOne = new map(57,52,32,canvas.width, ctx)
        this.PlayerOne = new player(canvas.width/2, canvas.height/2, 100, "png", 10, 56, 0, 0, 1 /*usw. */)
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
        //this.PlayerOne.draw()
        this.MapOne.draw(this.PlayerOne.globalX, this.PlayerOne.globalY)
        
        //enemy.draw()
        
    }

    spawnEnemy() {
        enemy = new enemy(map.leftBorder, map.topBorder, 100, "a.png", 10, 5, 0, 5, false)
    }
}

const Game = new game()
Game.start()