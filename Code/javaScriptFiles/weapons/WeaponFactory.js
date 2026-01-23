/*
 * WeaponFactory: Erstellt Waffen basierend auf Typ
 * Zentrale Factory-Methode für alle Waffen
 *
 * WAFFEN-ÜBERSICHT:
 * =================
 * Simple Weapons (eigene Klasse, aber keine spezielle Logik):
 *   - BowWeapon, KnifeWeapon, FireballWeapon, MolotovWeapon
 *
 * Special Weapons (eigene Klasse MIT spezieller Logik):
 *   - ShurikenWeapon, ThunderstrikeWeapon, AuraWeapon, AxeWeapon
 */

import { Weapon } from "./Weapon.js";
// Simple Weapons
import { BowWeapon } from "./BowWeapon.js";
import { KnifeWeapon } from "./KnifeWeapon.js";
import { FireballWeapon } from "./FireballWeapon.js";
import { MolotovWeapon } from "./MolotovWeapon.js";
// Special Weapons
import { ShurikenWeapon } from "./ShurikenWeapon.js";
import { ThunderstrikeWeapon } from "./ThunderstrikeWeapon.js";
import { AxeWeapon } from "./AxeWeapon.js";
import { AuraWeapon } from "./AuraWeapon.js";
import { getWeaponConfig } from "./weapon-config.js";


/**
 * Factory-Methode: Erstelle Waffe aus Config
 * @param {string} type - Waffen-Typ (bow, knife, fireball, etc.)
 * @param {Entity} shooter - Wer schießt (Player oder Enemy)
 * @param {number} mapWidth - Kartenbreite
 * @param {number} mapHeight - Kartenhöhe
 * @param {number} gridWidth - Grid-Breite
 * @param {number} level - Waffen-Level (0 = nicht freigeschaltet)
 * @returns {Weapon|null} - Waffen-Instanz oder null
 */
export function createWeapon(type, shooter, mapWidth, mapHeight, gridWidth, level = 1) {
    const config = getWeaponConfig(type);

    // Sicherheitscheck
    if (!config) {
        console.error(`Waffen-Config für "${type}" nicht gefunden!`);
        return null;
    }

    // Level 0 = Waffe nicht freigeschaltet
    if (level <= 0) {
        return null;
    }

    // Context Objekt erstellen
    const context = { shooter, mapWidth, mapHeight, gridWidth, config };

    // Erstelle Waffe basierend auf Typ
    // Wir übergeben null für icon/desc/name, damit die Klasse sie aus der Config holt
    switch (type) {
        // Simple Weapons (keine spezielle Logik, aber eigene Klasse für Übersichtlichkeit)
        case "bow":          return new BowWeapon(null, null, level, null, context);
        case "knife":        return new KnifeWeapon(null, null, level, null, context);
        case "fireball":     return new FireballWeapon(null, null, level, null, context);
        case "molotov":      return new MolotovWeapon(null, null, level, null, context);

        // Special Weapons (mit spezieller Logik)
        case "shuriken":     return new ShurikenWeapon(null, null, level, null, context);
        case "thunderstrike": return new ThunderstrikeWeapon(null, null, level, null, context);
        case "aura":         return new AuraWeapon(null, null, level, null, context);
        case "axe":          return new AxeWeapon(null, null, level, null, context);

        // Fallback: Generische Weapon-Klasse (für basic, basicEnemy, etc.)
        default:
            return new Weapon(null, null, level, null, context);
    }
}

Weapon.create = createWeapon;
