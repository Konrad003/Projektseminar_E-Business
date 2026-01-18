import {Equipment} from "./equipment.js";

export class EquipmentValor extends Equipment {
    constructor() {
        super("Valor", "valor_icon.png");
        this.level = 1;
        this.baseDamageBonus = 0.2; // 20% Bonus pro Level
        this.currentAppliedBonus = 0;
    }

    update(player, map, inputState) {
        let targetBonus = this.level * this.baseDamageBonus;

        // Nur anwenden, wenn sich der Bonus geändert hat (z.B. durch Level Up)
        if (this.currentAppliedBonus !== targetBonus) {
            this.apply(player, targetBonus);
        }
    }

    apply(player, targetBonus) {
        // Zuerst den alten Bonus entfernen, dann den neuen hinzufügen
        player.damageMultiplier -= this.currentAppliedBonus;
        player.damageMultiplier += targetBonus;
        
        // Den aktuell wirkenden Bonus speichern
        this.currentAppliedBonus = targetBonus;
        
        console.log(`[Valor] ${this.name} angewendet: +${(targetBonus * 100).toFixed(0)}% Schaden. Neuer Multiplikator: ${player.damageMultiplier.toFixed(1)}`);
    }
}