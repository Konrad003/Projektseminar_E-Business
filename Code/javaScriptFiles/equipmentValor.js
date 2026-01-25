import { Equipment } from "./equipment.js";

export class EquipmentValor extends Equipment {
    constructor() {
        // Erhöht damageMultiplier um 0.2 (20%) pro Level
        super("valor_icon.png", "Increases overall damage", "valor_picture.png", "Valor", "damageMultiplier", 0.2);
    }
}