import { Equipment } from "./equipment.js";

export class EquipmentArmor extends Equipment {
    constructor() {
        // Name, Icon, Player-Variable, Wert pro Level
        super("Armor", "armor_icon.png", "armor", 2);
    }
}