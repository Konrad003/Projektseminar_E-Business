import {MovingEntity} from "./movingEntity.js"
import {Weapon} from "./weapon.js";

export class Player extends MovingEntity {
    ctx
    xpForNextLevel;

    constructor(globalEntityX, globalEntityY, hp, maxHp, xp, png, speed, hitbox, ausrüstung = [], weapons = [], regeneration = 0, ctx, onDeath, canvasWidthMiddle, canvasHeightMiddle, mapWidth, mapHeight, gridWidth) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hp = hp;
        this.maxHp = maxHp;
        this.xp = xp;
        this.level = 1;
        this.png = png;
        this.baseSpeed = speed;
        this.speed = 2     ;
        this.hitbox = hitbox;
        this.ausrüstung = ausrüstung;
        this.weapons = weapons;
        this.regeneration = regeneration;
        this.ctx = ctx;
        this.onDeath = onDeath;

        this.canvasWidthMiddle = canvasWidthMiddle
        this.canvasWidthHeight = canvasHeightMiddle

        this.xpForNextLevel = this.level * 10;
        this.weapon = Weapon.create("basic", this, mapWidth, mapHeight, gridWidth)
        this.enemyItemDrops = []

    }

    handleInput(map, inputState) {
        let speed = this.speed
        if ((inputState.rightPressed || inputState.leftPressed)         //Diagonalbewegung smoother
            && (inputState.upPressed || inputState.downPressed)) {
            speed /= 1.8
        }
        if (inputState.rightPressed) {
            this.globalEntityX = map.rightFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
        }
        if (inputState.upPressed) {
            this.globalEntityY = map.topFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
        }
        if (inputState.leftPressed) {
            this.globalEntityX = map.leftFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
        }
        if (inputState.downPressed) {
            this.globalEntityY = map.downFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
        }
    }

    lvlUp() {
        Game.lvlUPshow()
        this.level++;
        this.xpForNextLevel = this.level * 10; //warum hier? muss das nicht in lvlup funktion (achtet bitte auf eure leerzeichen)
        document.getElementById("hudXpProgress").style.max = this.xpForNextLevel;
    }

    die() {
        //console.log("Player ist gestorben!"); //zum testen, da noch keine end funktion in game
        this.onDeath();
    }

    collectXp(xpAmount) {
        this.xp += xpAmount;

        if (this.xp >= this.xpForNextLevel) {
            this.xp -= this.xpForNextLevel; // Überschüssige XP behalten
            this.lvlUp();
        }
        Game.hudXpProgress.value = this.xp;
    }

    render(map, inputState, performanceNow, enemies, gridWidth) {
        this.handleInput(map, inputState)
        this.draw(this.ctx, this)
        this.weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth, this.enemyItemDrops)
        for (let i = this.enemyItemDrops.length - 1; i >= 0; i--){
            let item = this.enemyItemDrops[i]
            item.render(this.ctx, this, this.enemyItemDrops, i)
        }
    }
       getColor() {
        return 'blue'
       }
}
