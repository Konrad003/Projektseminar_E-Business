import { Entity } from "./entity.js";
export class Player extends Entity {
    ctx
      
    constructor(playerGlobalX, playerGlobalY, hp, png, speed, hitbox, ausrüstung = [], weapons = [], regeneration = 0, ctx) {
        super(playerGlobalX, playerGlobalY, hp, png, speed, hitbox)
        this.playerGlobalY = playerGlobalY
        this.playerGlobalX = playerGlobalX
        this.xp = 0;
        this.level = 1;
        this.ausrüstung = ausrüstung;
        this.weapons = weapons;
        this.regeneration = regeneration;
        this.ctx = ctx   
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

    drawPlayer(x, y, width, height, color) {
        this.ctx.beginPath()
        this.ctx.rect(x, y, width, height)
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    render(){
        
    }
}