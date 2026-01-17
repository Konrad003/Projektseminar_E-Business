import {MovingEntity} from "./movingEntity.js"
import {Weapon} from "./weapon.js";
import { EquipmentDash } from "./equipmentDash.js";

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
        this.damageMultiplier = 1.0; // für equipment valor. Standardmäßig 100% Schaden
        this.cooldownMultiplier = 1.0; // für equipment rapid fire. Standardmäßig 100% Feuerrate
        this.isInvincible = false; // für equipment holy aura
        this.armor = 0; // für equipment armor
        this.extraProjectiles = 0; // für equipment barrage
        this.hitbox = hitbox;
        this.equipmentSlots = [null, null, null]; // Drei leere Slots für Equipment
        this.regeneration = regeneration;
        this.ctx = ctx;
        this.onDeath = onDeath;

        this.canvasWidthMiddle = canvasWidthMiddle
        this.canvasWidthHeight = canvasHeightMiddle

        this.xpForNextLevel = this.level * 10;
        this.weapon = Weapon.create("basic", this, mapWidth, mapHeight, gridWidth)
        this.enemyItemDrops = []

    }

    draw(ctx, player) {
        // Wenn die Aura aktiv ist, wird Zeichnen angepasst
        if (this.isInvincible) {
            ctx.save(); // Speichert den aktuellen Zustand (Normalzustand)
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = "cyan"; // Ein heiliges, blaues Leuchten
            ctx.globalAlpha = 0.7 + Math.sin(performance.now() / 150) * 0.3; // Blink-Effekt
        }

        // draw-Methode der Basisklasse (Entity)
        super.draw(ctx, player);

        // Wenn wir den Zustand verändert hatten, setzen wir ihn jetzt wieder zurück
        if (this.isInvincible) {
            ctx.restore(); // Setzt Schatten und Alpha wieder auf Standard
        }
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
        // Start neuer Trail-Logik
        if (EquipmentDash.dashTrails && EquipmentDash.dashTrails.length > 0) {
            this.ctx.save();
            
            // Kamera-Berechnung
            let leftBorder = this.globalEntityX - (this.ctx.canvas.width / 2);
            let topBorder = this.globalEntityY - (this.ctx.canvas.height / 2);

            for (let i = EquipmentDash.dashTrails.length - 1; i >= 0; i--) {
                let trail = EquipmentDash.dashTrails[i];

                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${trail.alpha})`;
                this.ctx.lineWidth = 20;
                this.ctx.lineCap = "round";

                this.ctx.moveTo(trail.startX - leftBorder, trail.startY - topBorder);
                this.ctx.lineTo(trail.endX - leftBorder, trail.endY - topBorder);
                this.ctx.stroke();

                // Ausfaden
                trail.alpha -= 0.03;
                if (trail.alpha <= 0) {
                    EquipmentDash.dashTrails.splice(i, 1);
                }
            }
            this.ctx.restore();
        }
        // Ende neuer Trail-Logik

        this.handleInput(map, inputState)
        this.draw(this.ctx, this)
        this.equipmentSlots.forEach(item => { // Jedes ausgerüstete Equipment updaten
            if (item) {
                item.update(this, map, inputState);
            }
        });
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