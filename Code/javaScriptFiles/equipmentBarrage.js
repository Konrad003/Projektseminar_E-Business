import {Equipment} from "./equipment.js";

export class EquipmentBarrage extends Equipment {
    constructor() {
        super("Barrage", "barrage_icon.png");
        this.level = 1;
        this.currentAppliedExtra = 0;
    }

    update(player, map, inputState) {
        // Levellogik: Level 1-3 = +1, Level 4-6 = +2, Level 7-9 = +3, sonst zu op
        // Wir teilen das Level durch 3 und runden auf
        let targetExtra = Math.ceil(this.level / 3);

        if (this.currentAppliedExtra !== targetExtra) {
            this.apply(player, targetExtra);
        }
    }

    apply(player, targetExtra) {
        // Alten Bonus entfernen
        player.extraProjectiles -= this.currentAppliedExtra;
        
        // Neuen Bonus hinzufügen
        player.extraProjectiles += targetExtra;
        
        this.currentAppliedExtra = targetExtra;
        
        console.log(`[Barrage] Level ${this.level}: +${this.currentAppliedExtra} zusätzliche Projektile.`);
    }
}