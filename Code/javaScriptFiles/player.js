import {MovingEntity} from "./movingEntity.js"
import {Weapon} from "./weapon.js";

export class Player extends MovingEntity {
    ctx
    xpForNextLevel;

    constructor(globalEntityX, globalEntityY, hp, maxHp, xp, png, speed, hitbox, equipmentSlots = [null, null, null], weapons = [], regeneration = 0, ctx, onDeath, canvasWidthMiddle, canvasHeightMiddle, mapWidth, mapHeight, gridWidth) {
        super(globalEntityX, globalEntityY, hp, png, speed, hitbox)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hp = hp;
        this.maxHp = maxHp;
        this.xp = xp;
        this.level = 1;
        this.png = png;
        this.baseSpeed = speed;
        this.hitbox = hitbox;
        this.equipmentSlots = [null, null, null]; // Drei leere Slots für Equipment
        this.regeneration = regeneration;
        this.ctx = ctx;
        this.onDeath = onDeath;

        this.canvasWidthMiddle = canvasWidthMiddle
        this.canvasWidthHeight = canvasHeightMiddle

        this.xpForNextLevel = this.level * 10;
        this.weapon = Weapon.create("basic", this, mapWidth, mapHeight, gridWidth)
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
        this.lvlUpChoose()
        this.level++;
        this.xpForNextLevel = this.level * 10; //warum hier? muss das nicht in lvlup funktion (achtet bitte auf eure leerzeichen)
        document.getElementById("hudXpProgress").style.max = this.xpForNextLevel;
    }

    die() {
        //console.log("Player ist gestorben!"); //zum testen, da noch keine end funktion in game
        this.onDeath();
    }

    collectPickup(item) { //wird von game aufgerufen wenn collision mit item, übergibt logik an itemklasse
        if (!item) return;
        item.apply(this);
    }

    collectXp(xpAmount) {
        this.xp += xpAmount;

        if (this.xp >= this.xpForNextLevel) {
            this.xp -= this.xpForNextLevel; // Überschüssige XP behalten
            this.lvlUp();
        }
        Game.hudXpProgress.value = this.xp;
    }

    acquireEquipment(newEquipment) {
    for (let i = 0; i < this.equipmentSlots.length; i++) {
        if (this.equipmentSlots[i] === null) {
            this.equipmentSlots[i] = newEquipment;
            console.log(newEquipment.name + " ausgerüstet in Slot " + i);
            return true; 
        }
    }
    console.log("Inventar voll!");
    return false;
    }

    render(map, inputState, performanceNow, enemies, gridWidth) {
        this.handleInput(map, inputState)

        this.equipmentSlots.forEach(item => { // Jedes ausgerüstete Equipment updaten
            if (item) {
                item.update(this, map, inputState);
            }
        });
        this.weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth)
        this.draw(this.ctx, this, 'blue')
    }
}
