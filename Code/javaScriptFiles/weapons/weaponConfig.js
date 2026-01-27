import { BasicProjectile } from '../projectiles/BasicProjectile.js';
import { FireballProjectile } from '../projectiles/FireballProjectile.js';
import { MolotovProjectile } from '../projectiles/MolotovProjectile.js';
import { OrbitingProjectile } from '../projectiles/OrbitingProjectile.js';
import { BoomerangProjectile } from '../projectiles/BoomerangProjectile.js';
import { Weapon } from "./Weapon.js";
import { BowWeapon } from "./BowWeapon.js";
import { KnifeWeapon } from "./KnifeWeapon.js";
import { FireballWeapon } from "./FireballWeapon.js";
import { MolotovWeapon } from "./MolotovWeapon.js";
import { ShurikenWeapon } from "./ShurikenWeapon.js";
import { ThunderstrikeWeapon } from "./ThunderstrikeWeapon.js";
import { BoomerangWeapon } from "./BoomerangWeapon.js";
import { AuraWeapon } from "./AuraWeapon.js";

export class WeaponConfig {


static createWeapon(name, shooter, mapWidth, mapHeight, gridWidth, level = 1) {
    // Sicherheitscheck
    if (!name || name === null) {
        //console.error(`Waffen-Config für "${name}" nicht gefunden!`);
        return null;
    }

    // Level 0 = Waffe nicht freigeschaltet
    if (level <= 0) {
        return null;
    }
/**
 * Struktur: {
 *   name: "Bow",
 *   dmg: 100,                          // Schaden pro Treffer (Base)
 *   cooldown: 1000,                    // ms zwischen Schüssen (Base)
 *   range: 1000,                       // Zielweite (Base)
 *   piercing: 0,                       // 0 = stop on hit, 1+ = pierce (Base)
 *   projectile: ProjectileClass,       // Welche Projectile-Klasse
 *   projectileConfig: { ... }          // Projectile-spezifische Daten
 *   maxLevel: 20                       // Max erreichbares Level
 * }
 */
    // Erstelle Waffe basierend auf Typ
    // Wir übergeben null für icon/desc/name, damit die Klasse sie aus der Config holt
    switch (name) {
        // Simple Weapons (keine spezielle Logik, aber eigene Klasse für Übersichtlichkeit)
        case "Bow":          return new BowWeapon("./Graphics/equipmentIcons/PNG/2.png", "Fast piercing arrows", level, "Bow", shooter, mapWidth, mapHeight, gridWidth,
        45,
        1000,
        1000,
        0,
        20,
        1,  // Spieler startet mit Bow Level 1
        false,
        BasicProjectile,
       {
            speed: 6,
            size: 6,
            duration: 3000,
            amount: 1  // Basis-Anzahl Projektile
        });
        case "Knife":        return new KnifeWeapon("./Graphics/equipmentIcons/PNG/10.png", "Quick throwing knives", level, "Knife", shooter, mapWidth, mapHeight, gridWidth,
        20,
        400,
        600,
        0,
        20,
        1,
        true,
        BasicProjectile,
        {
            speed: 9,
            size: 5,
            duration: 2000,
            amount: 1
        });
        case "Fireball":     return new FireballWeapon("./Graphics/equipmentIcons/PNG/8.png", "Explosive fire attack", level, "Fireball", shooter, mapWidth, mapHeight, gridWidth,
        80,
        2000,
        1500,
        0,
        20,
        1,
        false,
        FireballProjectile,
         {
            speed: 5,
            size: 18,
            duration: 3000,
            explosionRadius: 100,
            explosionColor: 'rgba(255, 50, 0, 0.9)',
            amount: 1});
        case "Molotov":      return new MolotovWeapon("./Graphics/equipmentIcons/PNG/5.png", "Burning area damage", level, "Molotov", shooter, mapWidth, mapHeight, gridWidth,
        20,
        1800,
        1500,
        0,
        20,
        1,
        false,
        MolotovProjectile,
        {
            speed: 200,
            size: 8,
            flightDuration: 1000,
            dotRadius: 100,
            dotDmg: 25,
            dotInterval: 500,
            amount: 1
        });

        // Special Weapons (mit spezieller Logik)
        case "Shuriken":     return new ShurikenWeapon("./Graphics/equipmentIcons/PNG/3.png", "Orbiting blade stars", level, "Shuriken", shooter, mapWidth, mapHeight, gridWidth,
        25,
        150,
        700,
        999,
        20,
        1,
        true,
        OrbitingProjectile,
         {
            amount: 1,  // Basis: 2 Shuriken
            orbitRadius: 100,
            orbitSpeed: 1.5,
            size: 15,
            piercing: 10000,
            shooter : shooter
            });
        case "Thunderstrike": return new ThunderstrikeWeapon( "./Graphics/equipmentIcons/PNG/9.png", "Lightning bolt strike", level, "Thunderstrike", shooter, mapWidth, mapHeight, gridWidth,
         50,
         1500,
         300,
         0,
        20,
        1,
        true,
        null, // Kein Projektil
         {
            lightningLength: 300,
            lightningDuration: 150,
            lightningCount: 2});
        case "Aura":         return new AuraWeapon("./Graphics/equipmentIcons/PNG/7.png", "Damaging aura field", level, "Aura", shooter, mapWidth, mapHeight, gridWidth,
         15,
         0.5,
         150,
         0,
         20,
         1,
         true,
         null, // Kein Projektil
         {
            auraRadius: 150,
            auraDmgInterval: 500,
            auraColor: 'rgba(255, 255, 100, 0.3)'});
        case "Boomerang":          return new BoomerangWeapon("./Graphics/equipmentIcons/PNG/11.png", "Returning boomerang", level, "Boomerang", shooter, mapWidth, mapHeight, gridWidth,
        20,
        1500,
        600,
        999,
        20,
        1,
        true,
        BoomerangProjectile,
         {
            speed: 8,
            size: 300,
            maxRange: 500,
            piercing: 999,
            shooter: shooter,
            });

        case "WitchFireball":
            return new FireballWeapon(
                null, "Witch Fireball", level, "WitchFireball", shooter, mapWidth, mapHeight, gridWidth,
                25,   // Schaden
                2000, // Cooldown
                600,  // Range
                0,    // Piercing
                1,    // MaxLevel
                1,    // StartLevel
                false,// isSpecial
                FireballProjectile,
                { speed: 4, size: 15, duration: 3000, explosionRadius: 80, explosionColor: 'rgba(138, 43, 226, 0.8)', amount: 1, isEnemy: true },
                80,   // ExplosionRadius (für Weapon Stats)
                'rgba(138, 43, 226, 0.8)' // ExplosionColor
            );

        case "BasicEnemy":
            return new Weapon(
                null, "Enemy Arrow", level, "EnemyArrow", shooter, mapWidth, mapHeight, gridWidth,
                15,
                1500,
                600,
                0,
                1,
                1,
                false,
                BasicProjectile,
                { speed: 3 , size: 15, duration: 2000, isEnemy: true }
            );

        // Fallback: Generische Weapon-Klasse (für basic, basicEnemy, etc.)
        default:
            return new Weapon("./Graphics/equipmentIcons/PNG/2.png", "Fast piercing arrows", level, "Bow", shooter, mapWidth, mapHeight, gridWidth,
        10,
        1000,
        1000,
        0,
        20,
        1,  // Spieler startet mit Bow Level 1
        false,
        BasicProjectile,
       {
            speed: 6,
            size: 6,
            duration: 3000,
            amount: 1  // Basis-Anzahl Projektile
            });
        }
    }
}