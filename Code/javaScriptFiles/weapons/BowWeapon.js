import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * BowWeapon: Standard-Fernkampfwaffe
 *
 * KATEGORIE: Simple (keine spezielle Logik)
 * PROJEKTIL: BasicProjectile
 * ZIEL: Nächster Feind
 *
 * Besonderheit: Spieler startet mit dieser Waffe (startLevel: 1)
 *
 * Diese Klasse existiert für Übersichtlichkeit -
 * sie nutzt die generische Weapon-Logik ohne Änderungen.
 */
export class BowWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("bow");
        super(icon, description, level, name, { ...context, config });
    }
}