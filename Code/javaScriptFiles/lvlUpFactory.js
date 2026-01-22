import {EquipmentArmor} from "./equipments/equipmentArmor.js"
import {EquipmentDamage} from "./equipments/equipmentDamage.js"
import {EquipmentExtraProjectile} from "./equipments/equipmentExtraProjectile.js"
import {EquipmentHaste} from "./equipments/equipmentHaste.js"
import {EquipmentInvincibility} from "./equipments/equipmentInvincibility.js"
import {EquipmentRapidFire} from "./equipments/equipmentRapidFire.js"
import {EquipmentMaxHealth} from "./equipments/equipmentMaxHealth.js";
import {EquipmentDash} from "./equipments/equipmentDash.js";

export class LvlUpFactory {
    constructor() {
        this.alleObjekte = [new EquipmentArmor("./Graphics/equipmentIcons/PNG/18.png", "Reduces incoming damage", 1, "Armor", "armor", 2),
            new EquipmentDamage("./Graphics/equipmentIcons/PNG/6.png", "Increases overall damage", 1, "Damage", "damageMultiplier", 0.2),
            new EquipmentDash("./Graphics/equipmentIcons/PNG/12.png", "Allows a quick dodge move", 1, "Dash", null, 0),
            new EquipmentExtraProjectile("./Graphics/equipmentIcons/PNG/1.png", "Fires extra projectiles", 1, "ExtraProjectile", "extraProjectiles", 0),
            new EquipmentHaste("./Graphics/equipmentIcons/PNG/20.png", "Increases movement speed", 1, "Haste", "speed", 0.5),
            new EquipmentInvincibility("./Graphics/equipmentIcons/PNG/17.png", "Grant temporary invincibility", 1, "Invincibility", "isInvincible", 0),
            new EquipmentMaxHealth("./Graphics/equipmentIcons/PNG/15.png", "Increases maximum health", 1, "MaxHealth", "maxHp", 50),
            new EquipmentRapidFire("./Graphics/equipmentIcons/PNG/16.png", "Reduces attack cooldown", 1, "RapidFire", "cooldownMultiplier", -0.1)]
    }

    lvlUpRoll() {
        const lvlRolled = new Set()

        while (lvlRolled.size < 3) {
            const lvlZufall = Math.floor(Math.random() * 8)
            //console.log(lvlZufall);
            lvlRolled.add(this.alleObjekte[lvlZufall]);
        }
        let i = 1
        for (const value of lvlRolled) {
            document.getElementById("lvl" + i + "Img").src = value.icon;
            i++
        }
    }
}