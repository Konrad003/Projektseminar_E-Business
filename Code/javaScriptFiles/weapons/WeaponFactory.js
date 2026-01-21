/**
 * WeaponFactory: Erstellt Waffen basierend auf Typ
 * Zentrale Factory-Methode für alle Waffen
 */

import { Weapon } from "./Weapon.js";
import { ShurikenWeapon } from "./ShurikenWeapon.js";
import { ThunderstrikeWeapon } from "./ThunderstrikeWeapon.js";
import { AxeWeapon } from "./AxeWeapon.js";
import { AuraWeapon } from "./AuraWeapon.js";
import { getWeaponConfig } from "../weapon-config.js";

/**
 * Factory-Methode: Erstelle Waffe aus Config
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

    // Spezial-Waffen mit Custom-Logik
    if (config.isSpecial) {
        switch (type) {
            case "shuriken": return new ShurikenWeapon(shooter, mapWidth, mapHeight, gridWidth, level);
            case "thunderstrike": return new ThunderstrikeWeapon(shooter, mapWidth, mapHeight, gridWidth, level);
            case "aura": return new AuraWeapon(shooter, mapWidth, mapHeight, gridWidth, level);
            case "axe": return new AxeWeapon(shooter, mapWidth, mapHeight, gridWidth, level);
        }
    }

    // Standard-Waffen: nutze generische Klasse
    return new Weapon(config, shooter, mapWidth, mapHeight, gridWidth, level);
}

// Auch als statische Methode auf Weapon für Rückwärtskompatibilität
Weapon.create = createWeapon;
