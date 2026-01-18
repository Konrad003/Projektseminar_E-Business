import { Equipment } from "./equipment.js";

export class EquipmentArmor extends Equipment {
    constructor() {
        // Name, Icon, Player-Variable, Wert pro Level
        super("armor_icon.png", "Reduces incoming damage", "armor_picture.png", "Armor", "armor", 2);
    }
}