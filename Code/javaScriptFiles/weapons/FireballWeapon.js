import { Weapon } from "./Weapon.js";
import { getWeaponConfig } from "./weapon-config.js";

/**
 * FireballWeapon: Explosiver Fernkampf
 *
 * KATEGORIE: Simple (keine spezielle Logik)
 * PROJEKTIL: FireballProjectile
 * ZIEL: Nächster Feind
 *
 * Besonderheit: Das FireballProjectile hat eine Explosion bei Aufprall,
 * die AoE-Schaden verursacht. Die Explosionslogik ist im Projektil selbst.
 *
 * Diese Klasse existiert für Übersichtlichkeit -
 * sie nutzt die generische Weapon-Logik ohne Änderungen.
 */
export class FireballWeapon extends Weapon {
    constructor(icon, description, level, name, context) {
        const config = getWeaponConfig("fireball");
        super(icon, description, level, name, { ...context, config });
    }
}