import {MovingEntity} from "./movingEntity.js"
import {Weapon} from "./weapons/index.js";
import {EquipmentDash} from "./equipments/equipmentDash.js";
import {LvlUpFactory} from "./lvlUpFactory.js"
import {Equipment} from "./equipment.js";

export class Player extends MovingEntity {
    ctx
    xpForNextLevel;

 // Waffen-Level-Tracking: 0 = nicht freigeschaltet, 1-20 = aktives Level
    weaponLevels = {
        bow: 1,           // Alle auf Level 1 für Testing
        knife: 0,
        fireball: 0,
        molotov: 0,
        shuriken: 0,
        thunderstrike: 0,
        aura: 0,
        axe: 0,
        basic: 1          // Für Enemy-Waffen
    };

    constructor(globalEntityX, globalEntityY, hp, maxHp, xp, png, speed, hitbox, equipmentSlots = [null, null, null, null, null, null], weapons = [], regeneration = 0, ctx, onDeath, canvasWidthMiddle, canvasHeightMiddle, mapWidth, mapHeight, gridWidth) {
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
        this.equipmentSlots = [null, null, null, null, null, null]; // sechs leere Slots für Equipment
        this.weaponSlots = [null, null, null, null, null, null]; // sechs leere Slots für Equipment
        this.regeneration = regeneration;
        this.ctx = ctx;
        this.onDeath = onDeath;

        // Equipment-Multiplier (für Equipment-System)
        this.damageMultiplier = 1.0;      // Equipment Valor
        this.cooldownMultiplier = 1.0;    // Equipment Rapid Fire
        this.isInvincible = false;        // Equipment Holy Aura
        this.armor = 0;                   // Equipment Armor
        this.extraProjectiles = 0;        // Equipment Barrage
        this.equipmentSlots = [null, null, null]; // Drei Equipment-Slots

        this.canvasWidthMiddle = canvasWidthMiddle
        this.canvasWidthHeight = canvasHeightMiddle

        this.xpForNextLevel = this.level * 10;

        // Initialisiere Waffen-Slots mit Bogen (da Level 1)
        if (this.weaponLevels.bow > 0) {
            this.weaponSlots[0] = Weapon.create("bow", this, mapWidth, mapHeight, gridWidth, this.weaponLevels.bow);
        }

        this.enemyItemDrops = []

        // All weapons mode
        this.allWeaponsActive = false;
        this.allWeapons = [];

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.gridWidth = gridWidth;

        // Blickrichtung (wird durch Bewegung aktualisiert)
        this.facingDirection = { x: 1, y: 0 }; // Standard: rechts

        this.LvlUpFactory = new LvlUpFactory(this);
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

        // Blickrichtung aktualisieren basierend auf Bewegung
        let dirX = 0, dirY = 0;
        if (inputState.rightPressed) {
            this.globalEntityX = map.rightFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
            dirX = 1;
        }
        if (inputState.upPressed) {
            this.globalEntityY = map.topFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
            dirY = -1;
        }
        if (inputState.leftPressed) {
            this.globalEntityX = map.leftFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
            dirX = -1;
        }
        if (inputState.downPressed) {
            this.globalEntityY = map.downFree(this.globalEntityX, this.globalEntityY, speed, this.hitbox);
            dirY = 1;
        }

        // Nur aktualisieren wenn tatsächlich Bewegung stattfindet
        if (dirX !== 0 || dirY !== 0) {
            const length = Math.sqrt(dirX * dirX + dirY * dirY);
            this.facingDirection = { x: dirX / length, y: dirY / length };
        }
    }

    switchWeapon(weaponNumber) {

        // Waffen-Type basierend auf Nummer
        const weaponMap = {
            0: "knife",
            1: "bow",
            2: "thunderstrike",
            3: "knife",
            4: "molotov",
            5: "shuriken",
            6: "aura",
            7: "fireball",
            8: "knife",
            9: "axe"
        };

        const weaponType = weaponMap[weaponNumber];
        if (weaponType && this.weaponLevels[weaponType] > 0) {
            console.log("Switch Weapon deaktiviert für Multi-Weapon System");
        } else {
            console.log(`Waffe "${weaponType}" ist noch nicht freigeschaltet (Level 0)`);
        }
    }

    /**
     * Erhöht das Level einer Waffe um 1
     * @param {string} weaponType - z.B. "bow", "fireball", etc.
     * @returns {boolean} - true wenn erfolgreich, false wenn max Level erreicht
     */
    upgradeWeapon(weaponType) {
        const maxLevel = 20;
        if (this.weaponLevels[weaponType] < maxLevel) {
            this.weaponLevels[weaponType]++;
            console.log(`${weaponType} upgraded to Level ${this.weaponLevels[weaponType]}`);

            // Finde Waffe in Slots und upgrade sie
            const weapon = this.weaponSlots.find(w => w && w.config.type === weaponType);
            if (weapon) {
                weapon.lvlUp();
            }
            return true;
        }
        return false;
    }

    /**
     * Schaltet eine neue Waffe frei (setzt auf Level 1)
     * @param {string} weaponType - z.B. "knife", "fireball", etc.
     */
    unlockWeapon(weaponType) {
        if (this.weaponLevels[weaponType] === 0) {
            this.weaponLevels[weaponType] = 1;
            console.log(`${weaponType} freigeschaltet!`);

            // Neue Waffe erstellen und in freien Slot legen
            const newWeapon = Weapon.create(weaponType, this, this.mapWidth, this.mapHeight, this.gridWidth, 1);
            const freeSlot = this.weaponSlots.findIndex(s => s === null);
            if (freeSlot !== -1) {
                this.weaponSlots[freeSlot] = newWeapon;
            }
            return true;
        }
        return false; // Bereits freigeschaltet
    }
// New method to shoot all weapons at once for testing
    shootAllWeapons(currentTime, enemies, map) {
        // Toggle all weapons mode on/off
        this.allWeaponsActive = !this.allWeaponsActive;

        if (this.allWeaponsActive) {
            // Create all weapon instances (mit Level 1 für Testing)
            const weaponTypes = ["bow", "thunderstrike", "knife", "shuriken", "aura", "fireball", "axe", "molotov"];
            this.allWeapons = [];

            for (const weaponType of weaponTypes) {
                const level = this.weaponLevels[weaponType] || 1; // Mindestens Level 1 für Test
                const weapon = Weapon.create(weaponType, this, this.mapWidth, this.mapHeight, this.gridWidth, level);
                if (weapon) {
                    this.allWeapons.push(weapon);
                }
            }
        } else {
            // Clear all weapons
            this.allWeapons = [];
        }
    }

    lvlUp() {
        this.LvlUpFactory.lvlUpRoll(this.equipmentSlots, this.weaponSlots)
        Game.lvlUPshow()
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

        this.xp = Math.floor(this.xp)

        if (this.xp >= this.xpForNextLevel) {
            this.xp -= this.xpForNextLevel; // Überschüssige XP behalten
            this.lvlUp();
        }
        Game.hudXpProgress.value = this.xp;
    }


    acquireEquipment(newEquipment) {
        if (newEquipment instanceof Equipment) {        // ist ein Equipment
            for (let i = 0; i < this.equipmentSlots.length; i++) {
                if (this.equipmentSlots[i] === null) {

                    this.equipmentSlots[i] = newEquipment;
                    console.log(newEquipment.name + " ausgerüstet in Slot " + i);
                    return true;
                } else if (newEquipment.constructor === this.equipmentSlots[i].constructor) {
                    newEquipment.lvlUp();
                    return true
                }
            }
            console.log("EquipmentInventar voll!");
            return false;
        } else if (newEquipment instanceof Weapon) {
            // Waffen Logik (via LvlUpFactory Card)
            const type = newEquipment.config.type;
            if (this.weaponLevels[type] > 0) {
                this.upgradeWeapon(type);
            } else {
                this.unlockWeapon(type);
            }
            return true;
        }

    }


    render(map, inputState, performanceNow, enemies, gridWidth) {
        this.drawDashTrails();
        this.handleInput(map, inputState)
        this.draw(this.ctx, this)

        // Equipment-Updates
        this.equipmentSlots.forEach(item => { // Jedes ausgerüstete Equipment updaten
            if (item) {
                item.update(this, map, inputState);
            }
        });

        // Shoot & Render active weapons
        this.weaponSlots.forEach(weapon => {
            if (weapon) {
                weapon.shoot(this, performanceNow, enemies, map.tilelength, gridWidth, inputState, this.enemyItemDrops);
                weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth, this.enemyItemDrops, inputState);
            }
        });

        // Render all active weapons if in all weapons mode
        if (this.allWeaponsActive) {
            for (let weapon of this.allWeapons) {
                weapon.shoot(this, performanceNow, enemies, map.tilelength, gridWidth, inputState, this.enemyItemDrops);
                weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth, this.enemyItemDrops, inputState);
            }
        }

        for (let i = this.enemyItemDrops.length - 1; i >= 0; i--) {
            let item = this.enemyItemDrops[i]
            item.render(this.ctx, this, this.enemyItemDrops, i)
        }
    }

    /**
     * Entfernt alle Equipment-Effekte (für Reset)
     */
    resetEquipmentEffects() {
        this.damageMultiplier = 1.0;
        this.cooldownMultiplier = 1.0;
        this.isInvincible = false;
        this.armor = 0;
        this.extraProjectiles = 0;
    }

    drawDashTrails() {
        if (EquipmentDash.dashTrails && EquipmentDash.dashTrails.length > 0) {
            this.ctx.save();

            // Grenzen berechnen für die relative Positionierung (Kamera)
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

                // Alpha-Wert verringern (Ausfaden)
                trail.alpha -= 0.03;
                if (trail.alpha <= 0) {
                    EquipmentDash.dashTrails.splice(i, 1);
                }
            }
            this.ctx.restore();
        }
    }

    getColor() {
        return 'blue'
    }
}
