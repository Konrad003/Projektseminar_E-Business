import {MovingEntity} from "./movingEntity.js"
import {Weapon} from "./weapons/index.js";
import { EquipmentDash } from "./equipmentDash.js";

export class Player extends MovingEntity {
    ctx
    xpForNextLevel;

    // Waffen-Level-Tracking: 0 = nicht freigeschaltet, 1-20 = aktives Level
    weaponLevels = {
        bow: 1,           // Alle auf Level 1 für Testing
        knife: 1,
        fireball: 1,
        molotov: 1,
        shuriken: 1,
        thunderstrike: 1,
        aura: 1,
        axe: 1,
        basic: 1          // Für Enemy-Waffen
    };

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
        this.weapon = Weapon.create("bow", this, mapWidth, mapHeight, gridWidth, this.weaponLevels.bow);
        this.enemyItemDrops = []

        // All weapons mode
        this.allWeaponsActive = false;
        this.allWeapons = [];

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.gridWidth = gridWidth;

        // Blickrichtung (wird durch Bewegung aktualisiert)
        this.facingDirection = { x: 1, y: 0 }; // Standard: rechts
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
        // Alte Projektile clearen
        if (this.weapon && this.weapon.projectiles) {
            if (Array.isArray(this.weapon.projectiles) && this.weapon.projectiles.length > 0 && typeof this.weapon.projectiles[0] === 'object' && !Array.isArray(this.weapon.projectiles[0])) {
                // Orbiting weapon (simple array)
                this.weapon.projectiles = [];
            } else {
                // Grid-based weapon (3D array)
                for (let row = 0; row < this.weapon.projectiles.length; row++) {
                    for (let column = 0; column < this.weapon.projectiles[row].length; column++) {
                        this.weapon.projectiles[row][column].within = [];
                    }
                }
            }
        }

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
            this.weapon = Weapon.create(weaponType, this, this.mapWidth, this.mapHeight, this.gridWidth, this.weaponLevels[weaponType]);
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

            // Wenn aktuelle Waffe, neu erstellen mit neuem Level
            if (this.weapon && this.weapon.config && this.weapon.config.type === weaponType) {
                this.weapon = Weapon.create(weaponType, this, this.mapWidth, this.mapHeight, this.gridWidth, this.weaponLevels[weaponType]);
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

        // Shoot current weapon
        this.weapon.shoot(this, performanceNow, enemies, map.tilelength, gridWidth, inputState, this.enemyItemDrops);

        // Render current weapon
        this.weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth, this.enemyItemDrops, inputState)

        // Render all active weapons if in all weapons mode
        if (this.allWeaponsActive) {
            for (let weapon of this.allWeapons) {
                weapon.shoot(this, performanceNow, enemies, map.tilelength, gridWidth, inputState, this.enemyItemDrops);
                weapon.render(this.ctx, this, performanceNow, enemies, map, gridWidth, this.enemyItemDrops, inputState);
            }
        }

        for (let i = this.enemyItemDrops.length - 1; i >= 0; i--){
            let item = this.enemyItemDrops[i]
            item.render(this.ctx, this, this.enemyItemDrops, i)
        }
    }

    /**
     * Equipment-System: Rüstet ein Equipment aus
     * @param {object} equipment - Equipment-Objekt mit effect() Methode
     * @returns {boolean} - true wenn erfolgreich
     */
    acquireEquipment(equipment) {
        // Finde ersten freien Slot
        const freeSlotIndex = this.equipmentSlots.findIndex(slot => slot === null);
        
        if (freeSlotIndex === -1) {
            console.log("Alle Equipment-Slots belegt!");
            return false;
        }
        
        // Equipment in Slot speichern
        this.equipmentSlots[freeSlotIndex] = equipment;
        
        // Equipment-Effekt anwenden (falls vorhanden)
        if (equipment && typeof equipment.effect === 'function') {
            equipment.effect(this);
        }
        
        console.log(`Equipment "${equipment?.name || 'Unbekannt'}" in Slot ${freeSlotIndex + 1} ausgerüstet`);
        return true;
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
