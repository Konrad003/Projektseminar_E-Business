import { entity } from './entity.js';
import { player } from './player.js';
import { enemy } from './enemy.js';
import { map } from './map.js';
import { obstacles } from './obstacles.js';

class game {
    difficulty
    timesstamp

    constructor() {

    }

    start() {
        mapOne = new map(56,50,32)
        playerOne = new player(canvas.width/2, canvas.height/2, 100, "png", 10, 56, 0, 0, 1 /*usw. */)

        setInterval(5,render)
        
    }

    stop() {
        
    }

    resume() {
    }

    end() {
        
    }

    render() {
        mapOne.draw()
        playerOne.draw()
        
    }

    spawnEnemy() {

    }
}
