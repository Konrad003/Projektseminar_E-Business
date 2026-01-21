import {EquipmentArmor} from "./equipments/equipmentArmor.js"
import {EquipmentDamage} from "./equipments/equipmentDamage.js"
import {EquipmentExtraProjectile} from "./equipments/equipmentExtraProjectile.js"
import {EquipmentHaste} from "./equipments/equipmentHaste.js"
import {EquipmentInvincibility} from "./equipments/equipmentInvincibility.js"
import {EquipmentRapidFire} from "./equipments/equipmentRapidFire.js"
import {EquipmentMaxHealth} from "./equipments/equipmentMaxHealth.js";
import {EquipmentDash} from "./equipments/equipmentDash.js";

export class LvlUpFactory {
    constructor(PlayerOne) {
        this.equipmentObjekte = [new EquipmentArmor("./Graphics/equipmentIcons/PNG/18.png", "Reduces incoming damage", 1, "Armor", "armor", 2), new EquipmentDamage("./Graphics/equipmentIcons/PNG/6.png", "Increases overall damage", 1, "Damage", "damageMultiplier", 0.2), new EquipmentDash("./Graphics/equipmentIcons/PNG/12.png", "Allows a quick dodge move", 1, "Dash", null, 0), new EquipmentExtraProjectile("./Graphics/equipmentIcons/PNG/1.png", "Fires extra projectiles", 1, "ExtraProjectile", "extraProjectiles", 0), new EquipmentHaste("./Graphics/equipmentIcons/PNG/20.png", "Increases movement speed", 1, "Haste", "speed", 0.5), new EquipmentInvincibility("./Graphics/equipmentIcons/PNG/17.png", "Grant temporary invincibility", 1, "Invincibility", "isInvincible", 0), new EquipmentMaxHealth("./Graphics/equipmentIcons/PNG/15.png", "Increases maximum health", 1, "MaxHealth", "maxHp", 50), new EquipmentRapidFire("./Graphics/equipmentIcons/PNG/16.png", "Reduces attack cooldown", 1, "RapidFire", "cooldownMultiplier", -0.1)]
        this.weaponObjekte = [//new Weapon (icon, description, level, name, )
        ] // Hier können später Waffen hinzugefügt werden
        this.PlayerOne = PlayerOne;
        this.lvlRolled = new Set()
        const lvlButton1 = document.getElementById('lvl1Button');
        const lvlButton2 = document.getElementById('lvl2Button');
        const lvlButton3 = document.getElementById('lvl3Button');

        lvlButton1.addEventListener('click', function () {
            this.lvlUpButton(this.PlayerOne, 1);
        }.bind(this));

        lvlButton2.addEventListener('click', function () {
            this.lvlUpButton(this.PlayerOne, 2);
        }.bind(this));

        lvlButton3.addEventListener('click', function () {
            this.lvlUpButton(this.PlayerOne, 3);
        }.bind(this));
    }


    lvlUpRoll(equipmentSlots, weaponSlots) {
        this.lvlRolled.clear()
        let equipmentSlotsFull = this.checkSlotsFull(equipmentSlots)
        let weaponSlotsFull = this.checkSlotsFull(weaponSlots)
        if (equipmentSlotsFull) {
            this.equipmentObjekte = []
            for (let j = 0; j < equipmentSlots.length; j++) {
                this.equipmentObjekte[j] = equipmentSlots[j]
            }
        }
        if (weaponSlotsFull) {
            this.weaponObjekte = []
            for (let i = weaponSlots.length; i < weaponSlots.length + weaponSlots.length; i++) {
                this.weaponObjekte[i] = weaponSlots[i]
            }
        }
        let allObj = this.equipmentObjekte.concat(this.weaponObjekte)

        while (this.lvlRolled.size < 3) {
            const lvlZufall = Math.floor(Math.random() * allObj.length)
            this.lvlRolled.add(allObj[lvlZufall]);
        }

        let i = 1
        for (const value of this.lvlRolled) {
            document.getElementById("lvl" + i + "Img").src = value.icon;
            document.getElementById("lvl" + i + "Button").innerHTML = value.name;

            i++
        }
    }

    checkSlotsFull(slots) {
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] === null) {
                return false
            }
        }
        return true
    }

    lvlUpButton(PlayerOne, pressedButton) {
        let i = 1
        for (const value of this.lvlRolled) {
            if (pressedButton === i) {
                PlayerOne.acquireEquipment(value);
                break
            }
            i++
        }
    }


}