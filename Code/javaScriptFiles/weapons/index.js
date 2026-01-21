/**
 * Zentrale Export-Datei für alle Waffen-Klassen
 * Import: import { Weapon, ShurikenWeapon, ... } from "./weapons/index.js";
 */

// Factory importieren (fügt Weapon.create hinzu)
import "./WeaponFactory.js";

export { Weapon } from "./Weapon.js";
export { ShurikenWeapon } from "./ShurikenWeapon.js";
export { ThunderstrikeWeapon } from "./ThunderstrikeWeapon.js";
export { AxeWeapon } from "./AxeWeapon.js";
export { AuraWeapon } from "./AuraWeapon.js";
export { createWeapon } from "./WeaponFactory.js";
