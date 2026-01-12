import {EnemySlime} from "./EnemySlime.js"
import {EnemyReiter} from "./EnemyReiter.js"
import {EnemySensenmann} from "./EnemySensenmann.js"
import {EnemyHexe} from "./EnemyHexe.js"
import {EnemySchatzgoblin} from "./EnemySchatzgoblin.js"
import {EnemyGepanzerterRitter} from "./EnemyGepanzerterRitter.js"
import {EnemySkellet} from "./EnemySkellet.js" 
import {Enemy} from "./enemy.js"
import {Weapon} from "./weapon.js"
export class EnemyFactory{
    static spawnEnemyOutsideView(enemiesArray, player, canvas, tilewidth, gridWidth, mapWidth, mapHeight) {
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
        
        enemiesArray[gridMapTile.row][gridMapTile.column].within.push(EnemyFactory.createRandomEnemy(x, y, gridMapTile, mapWidth, mapHeight, gridWidth));
    }   
    static createRandomEnemy(globalEntityX, globalEntityY, gridMapTile, mapWidth, mapHeight, gridWidth) {  // muss statisch sein, da sie vor der Instanziierung eines Enemys aufgerufen wird
        const enemyTypes = [
            {cls: EnemySlime, weight: 70 , weapon: "dolch"},
            {cls: EnemyReiter, weight: 5, weapon: "dolch"},
            {cls: EnemySensenmann, weight: 5, weapon: "dolch"},
            {cls: EnemyHexe, weight: 3, weapon: "Feuerball"},
            {cls: EnemySchatzgoblin, weight: 100, weapon: "dolch"},
            {cls: EnemyGepanzerterRitter, weight: 1, weapon: "Schwert"},
            {cls: EnemySkellet, weight: 15, weapon: "Bogen"}
        ];

        let totalWeight = enemyTypes.reduce((sum, enemy) => sum + enemy.weight, 0)
        let random = Math.random() * totalWeight
        let weapon = "dolch"
        for (let enemy of enemyTypes) {
            random -= enemy.weight
            if (random < 0) {
                return new enemy.cls(globalEntityX, globalEntityY, null, null, null, null, gridMapTile, 0, 0, false, false, Weapon.create(enemy.weapon, Enemy,mapWidth, mapHeight, gridWidth))
            }
        }
    }
}