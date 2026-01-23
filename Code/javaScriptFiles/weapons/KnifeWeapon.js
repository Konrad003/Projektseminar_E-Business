import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * KnifeWeapon: Schnelle Nahkampf-Wurfwaffe
 *
 * KATEGORIE: Simple (keine spezielle Logik)
 * PROJEKTIL: BasicProjectile
 * ZIEL: Blickrichtung (useFacingDirection: true)
 *
 * Besonderheit: Schießt in die Richtung, in die der Spieler schaut,
 * anstatt auf den nächsten Feind zu zielen.
 *
 * Diese Klasse existiert für Übersichtlichkeit -
 * die useFacingDirection-Logik ist bereits in der Basis-Weapon implementiert.
 */
export class KnifeWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("knife");
        super(icon, description, level, name, { ...context, config });
    }
}