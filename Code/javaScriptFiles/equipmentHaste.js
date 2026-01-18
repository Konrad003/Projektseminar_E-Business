import { Equipment } from "./equipment.js";

export class EquipmentHaste extends Equipment {
    constructor() {
        super("haste_icon.png", "Increases movement speed", "haste_picture.png", "Haste", "speed", 0.5 /* Speed Bonus pro Level */ );
    }

    apply(player, targetValue) {
        // Die Logik der Basisklasse (speed berechnen und setzen) ausführen
        super.apply(player, targetValue);
        
        // Spezifische Zusatzlogik für Haste:
        player.baseSpeed = player.speed;
        
        console.log(`[Haste] Speed-Update: ${player.speed} (baseSpeed synchronisiert)`);
    }
}