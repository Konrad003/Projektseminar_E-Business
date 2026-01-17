import {Equipment} from "./equipment.js";

export class EquipmentArmor extends Equipment {
    constructor() {
        super("Armor", "armor_icon.png");
        this.level = 1;
        this.armorPerLevel = 2; // Zieht 2 Schaden pro Level ab
        this.currentAppliedArmor = 0;
    }

    update(player, map, inputState) {
        let targetArmor = this.level * this.armorPerLevel;

        // Nur aktualisieren, wenn sich das Level/der Wert geändert hat
        if (this.currentAppliedArmor !== targetArmor) {
            this.apply(player, targetArmor);
        }
    }

    apply(player, targetArmor) {
        // Zuerst den alten Rüstungswert vom Player entfernen
        player.armor -= this.currentAppliedArmor;
        
        // Dann den neuen Wert setzen
        player.armor += targetArmor;
        
        this.currentAppliedArmor = targetArmor;
        
        console.log(`[Armor] Rüstung erhöht auf: ${player.armor}. (Reduziert eingehenden Schaden um ${player.armor})`);
    }
}