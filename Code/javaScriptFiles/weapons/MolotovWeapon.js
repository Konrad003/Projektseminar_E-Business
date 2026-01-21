import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * MolotovWeapon: Flächenschaden über Zeit (DoT)
 *
 * KATEGORIE: Simple (keine spezielle Logik)
 * PROJEKTIL: MolotovProjectile
 * ZIEL: Nächster Feind
 *
 * Besonderheit: Das MolotovProjectile hinterlässt eine DoT-Zone am Aufprallort,
 * die kontinuierlichen Schaden verursacht. Die DoT-Logik ist im Projektil selbst.
 *
 * Diese Klasse existiert für Übersichtlichkeit -
 * sie nutzt die generische Weapon-Logik ohne Änderungen.
 */
export class MolotovWeapon extends Weapon {
    constructor(shooter, mapWidth, mapHeight, gridWidth, level = 1) {
        const config = getWeaponConfig("molotov");
        super(config, shooter, mapWidth, mapHeight, gridWidth, level);
    }
}
