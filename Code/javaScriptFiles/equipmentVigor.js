import { Equipment } from "./equipment.js";

export class EquipmentVigor extends Equipment {
    constructor() {
        super("Vigor", "vigor_icon.png", "maxHp", 50);
    }

    apply(player, targetValue) {
        const difference = targetValue - this.currentAppliedValue;
        
        // Die Basisklasse regelt player.maxHp
        super.apply(player, targetValue);
        
        // Wir heilen den Spieler zusätzlich um die Differenz
        player.hp += difference;
        
        console.log(`[Vigor] MaxHP erhöht. Spieler um ${difference} geheilt.`);
    }
}