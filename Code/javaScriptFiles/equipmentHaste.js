import {Equipment} from "./equipment.js";

export class EquipmentHaste extends Equipment {
    constructor() {
        super("Haste", "haste_icon.png");
        this.level = 1;
        this.baseSpeedBonus = 0.5; // Erhöht die Geschwindigkeit um 0.5 Einheiten pro Level
        this.currentAppliedBonus = 0;
    }

    update(player, map, inputState) {
        let targetBonus = this.level * this.baseSpeedBonus;

        // Nur anwenden, wenn sich der Level/Bonus geändert hat
        if (this.currentAppliedBonus !== targetBonus) {
            this.apply(player, targetBonus);
        }
    }

    apply(player, targetBonus) {
        // Zuerst den alten Bonus von der aktuellen Geschwindigkeit abziehen
        player.speed -= this.currentAppliedBonus;
        
        // Dann den neuen Bonus hinzufügen
        player.speed += targetBonus;
        
        // Auch die baseSpeed aktualisieren, damit Speed-Drops (aus dropSingleUse.js) auf den richtigen neuen Wert zurückkehren
        player.baseSpeed = player.speed;

        this.currentAppliedBonus = targetBonus;
        
        console.log(`[Haste] Geschwindigkeit erhöht um ${targetBonus}. Aktuelle Geschwindigkeit: ${player.speed}`);
    }
}