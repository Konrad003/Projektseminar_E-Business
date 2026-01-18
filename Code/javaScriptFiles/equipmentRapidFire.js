import { Equipment } from "./equipment.js";

export class EquipmentRapidFire extends Equipment {
    constructor() {
        // Verringert cooldownMultiplier um 0.1 (10%) pro Level
        super("Rapid Fire", "rapid_fire_icon.png", "cooldownMultiplier", -0.1);
    }

    update(player, map, inputState) {
        let targetValue = this.level * this.valuePerLevel;
        if (targetValue < -0.9) targetValue = -0.9; // Cap bei 90% Reduktion
        
        if (this.currentAppliedValue !== targetValue) {
            this.apply(player, targetValue);
        }
    }
}