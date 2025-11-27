import { MovingEntity } from "./movingEntity.js"
export class Player extends MovingEntity {
    ctx
      
    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox, ausrüstung = [], weapons = [], regeneration = 0, ctx) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
        this.playerX = globalEntityX
        this.playerY = globalEntityY
        this.xp = 0;
        this.level = 1;
        this.ausrüstung = ausrüstung;
        this.weapons = weapons;
        this.regeneration = regeneration;
        this.ctx = ctx  
        this.hp = hp;
        this.maxHp = hp;
        this.png = png;
        this.hitbox = hitbox;
    }

    
    handleInput(map, inputState) {
        let speed=this.speed
        if ((inputState.rightPressed || inputState.leftPressed)         //Diagonalbewegung smoother
            && (inputState.upPressed ||inputState.downPressed))
        speed/=1.8
        if (inputState.rightPressed)
            this.playerX = map.rightFree(this.playerX, this.playerY, speed);
        if (inputState.upPressed)
            this.playerY = map.topFree(this.playerX, this.playerY, speed);
        if (inputState.leftPressed)
            this.playerX = map.leftFree(this.playerX, this.playerY, speed);
        if (inputState.downPressed)
            this.playerY = map.downFree(this.playerX, this.playerY, speed);
    }
    

    lvlUp() {
        this.level++;
        this.hp = this.maxHp; // volle Heilung bei Level-Up
        this.speed += 0.2; // das sind nur beispiele, können wir dann ändern
        this.regeneration += 0.1;
        console.log(`Level Up! Neues Level: ${this.level}`);
    }

    die() {
        console.log("Player ist gestorben!"); //zum testen, da noch keine end funktion in game
        this.game.end();
    }
    

    collectPickup(item) { //wird von game aufgerufen wenn collision mit item, übergibt logik an itemklasse
        if (!item) return;
        item.apply(this);
    }

    draw(x, y, width, height, color) {
        this.ctx.beginPath()
        this.ctx.rect(x, y, width, height)
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
}