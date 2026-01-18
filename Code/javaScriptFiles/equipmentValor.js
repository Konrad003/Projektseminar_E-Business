import { Equipment } from "./equipment.js";

export class EquipmentValor extends Equipment {
    constructor() {
        // Erhöht damageMultiplier um 0.2 (20%) pro Level
        super("Valor", "valor_icon.png", "damageMultiplier", 0.2);
    }
}