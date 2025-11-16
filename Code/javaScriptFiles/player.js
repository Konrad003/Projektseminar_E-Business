import { entity } from "./entity.js";
export class Player extends Entity {
    constructor(globalX, globalY, hp, png, speed, hitbox, ausrüstung = [], weapons = [], regeneration = 0) {
        super(globalX, globalY, hp, png, speed, hitbox);
        this.xp = 0;
        this.level = 1;
        this.ausrüstung = ausrüstung;
        this.weapons = weapons;
        this.regeneration = regeneration;
    }

    handleInput(upPressed, downPressed, leftPressed, rightPressed, dt) {
        let dx = 0;
        let dy = 0;

        if (upPressed) dy -= 1;
        if (downPressed) dy += 1;
        if (leftPressed) dx -= 1;
        if (rightPressed) dx += 1;

        this.move(dx, dy, dt);
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

    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.png) return;

        const centerX = canvasWidth / 2 - this.hitbox.width / 2;
        const centerY = canvasHeight / 2 - this.hitbox.height / 2;

        ctx.drawImage(this.png, centerX, centerY, this.hitbox.width, this.hitbox.height);
    }
}