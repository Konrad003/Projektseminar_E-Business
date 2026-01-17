import {Equipment} from "./equipment.js";

export class EquipmentRapidFire extends Equipment {
    constructor() {
        super("Rapid Fire", "rapid_fire_icon.png");
        this.level = 1;
        this.cooldownReductionPerLevel = 0.1; // 10% Reduzierung pro Level
        this.currentAppliedReduction = 0;
    }

    update(player, map, inputState) {
        let targetReduction = this.level * this.cooldownReductionPerLevel;

        // Wir deckeln die Reduzierung bei 0.9 (90%), damit der Cooldown nie 0 oder negativ wird. später mit levelcap regeln.
        if (targetReduction > 0.9) targetReduction = 0.9;

        if (this.currentAppliedReduction !== targetReduction) {
            this.apply(player, targetReduction);
        }
    }

    apply(player, targetReduction) {
        // Alten Bonus rückgängig machen (draufrechnen)
        player.cooldownMultiplier += this.currentAppliedReduction;
        
        // Neuen Bonus anwenden (abziehen)
        player.cooldownMultiplier -= targetReduction;
        
        this.currentAppliedReduction = targetReduction;
        
        console.log(`[Rapid Fire] Cooldown auf ${(player.cooldownMultiplier * 100).toFixed(0)}% gesenkt.`);
    }
}