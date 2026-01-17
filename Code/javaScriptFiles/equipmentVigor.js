import { Equipment } from "./equipment.js";

export class EquipmentVigor extends Equipment {
    constructor() {
        super("Vigor", "vigor_icon.png");
        this.level = 1;
        this.baseHpBonus = 50;
        this.currentAppliedBonus = 0;
    }

    update(player, map, inputState) {
        let targetBonus = this.level * this.baseHpBonus;

        // Nur wenn das Ziel (targetBonus) nicht dem entspricht, was wir aktuell angewendet haben, rufen wir apply auf.
        if (this.currentAppliedBonus !== targetBonus) {
            this.apply(player, targetBonus);
        }
    }

    apply(player, targetBonus) {
        // Differenz berechnen (Wichtig für spätere Level-Ups!)
        const difference = targetBonus - this.currentAppliedBonus;
        
        // Werte am Player anpassen
        player.maxHp += difference;
        player.hp += difference; 
        
        // Den aktuell wirkenden Bonus speichern
        this.currentAppliedBonus = targetBonus;
        
        console.log(`[Vigor] ${this.name} angewendet: +${difference} MaxHP. Gesamt-Bonus: ${this.currentAppliedBonus}`);
    }
}