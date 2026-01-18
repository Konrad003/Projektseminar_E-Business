import { Equipment } from "./equipment.js";

export class EquipmentBarrage extends Equipment {
    constructor() {
        super("Barrage", "barrage_icon.png", "extraProjectiles", 0);
    }

    update(player, map, inputState) {
        // Levellogik: Level 1-3 = +1, Level 4-6 = +2, Level 7-9 = +3, sonst zu op
        let targetExtra = Math.ceil(this.level / 3); // teilen das Level durch 3 und runden auf

        if (this.currentAppliedValue !== targetExtra) {
            this.apply(player, targetExtra);
        }
    }
}