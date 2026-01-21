/**
 * Zentrale Export-Datei für alle Waffen-Klassen
 * Import: import { Weapon, BowWeapon, ... } from "./weapons/index.js";
 */

// Factory importieren (fügt Weapon.create hinzu)
import "./WeaponFactory.js";

// Basis-Klasse
export { Weapon } from "./Weapon.js";

// Simple Weapons (keine spezielle Logik)
export { BowWeapon } from "./BowWeapon.js";
export { KnifeWeapon } from "./KnifeWeapon.js";
export { FireballWeapon } from "./FireballWeapon.js";
export { MolotovWeapon } from "./MolotovWeapon.js";

// Special Weapons (mit spezieller Logik)
export { ShurikenWeapon } from "./ShurikenWeapon.js";
export { ThunderstrikeWeapon } from "./ThunderstrikeWeapon.js";
export { AxeWeapon } from "./AxeWeapon.js";
export { AuraWeapon } from "./AuraWeapon.js";

// Factory
export { createWeapon } from "./WeaponFactory.js";
