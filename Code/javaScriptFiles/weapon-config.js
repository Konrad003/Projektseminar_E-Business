import {
    BasicProjectile, FireballProjectile, MolotovProjectile,
    SlashProjectile, OrbitingProjectile, BoomerangProjectile
} from './projectile-refactored-v2.js';

/**
 * Struktur: {
 *   type: "bow",
 *   name: "Bow",
 *   dmg: 100,                          // Schaden pro Treffer
 *   cooldown: 1000,                    // ms zwischen Schüssen
 *   range: 1000,                       // Zielweite
 *   piercing: 0,                       // 0 = stop on hit, 1+ = pierce
 *   projectile: ProjectileClass,       // Welche Projectile-Klasse
 *   projectileConfig: { ... }          // Projectile-spezifische Daten
 * }
 */
export const WEAPONS = {
    //basic weapon player
    basic: {
        type: "basic",
        name: "Basic Gun",
        dmg: 10,
        cooldown: 500,
        range: 800,
        piercing: 0,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 5,
            size: 6,
            duration: 3000
        }
    },

    //  range weapons
    bow: {
        type: "bow",
        name: "Bow",
        dmg: 100,
        cooldown: 1000,
        range: 1000,
        piercing: 0,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 6,
            size: 6,
            duration: 3000  // ms bis auto-despawn
        }
    },

    knife: {
        type: "knife",
        name: "Knife",
        dmg: 40,
        cooldown: 400,
        range: 600,
        piercing: 0,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 8,
            size: 5,
            duration: 2000
        }
    },

    fireball: {
        type: "fireball",
        name: "Fireball",
        dmg: 100,
        cooldown: 1500,
        range: 1500,
        piercing: 0,
        projectile: FireballProjectile,
        projectileConfig: {
            speed: 5,
            size: 8,
            duration: 3000,
            explosionRadius: 100,
            explosionColor: 'rgba(255, 50, 0, 0.9)'
        }
    },

    molotov: {
        type: "molotov",
        name: "Molotov",
        dmg: 25,
        cooldown: 1200,
        range: 1500,
        piercing: 0,
        projectile: MolotovProjectile,
        projectileConfig: {
            speed: 200,
            size: 8,
            flightDuration: 1000,
            dotRadius: 100, //?
            dotDmg: 25,  //?
            dotInterval: 500  //?
        }
    },

    axe: {
        type: "axe",
        name: "Axe",
        dmg: 150,
        cooldown: 1500,
        range: 1000,
        piercing: 1,
        projectile: BoomerangProjectile,
        projectileConfig: {
            speed: 8,
            size: 10,
            maxRange: 400
        }
    },

    // SPECIAL WEAPONS (mit Custom-Logik)
    // Diese haben echte Custom-Logik und brauchen Klassen

    sword: {
        type: "sword",
        name: "Sword",
        dmg: 35,
        cooldown: 600,
        range: 200,
        piercing: 0,
        isSpecial: true,  // Nutzt SwordWeapon Klasse
        projectile: SlashProjectile,
        projectileConfig: {
            duration: 200,
            radius: 100, //?
            arcAngle: Math.PI * 0.5  //?
        }
    },

    shuriken: {
        type: "shuriken",
        name: "Shuriken",
        dmg: 25,
        cooldown: 150,
        range: 700,
        piercing: 1,
        isSpecial: true,  // Nutzt ShurikenWeapon Klasse
        projectile: OrbitingProjectile,
        projectileConfig: {
            amount: 3,
            orbitRadius: 100,
            orbitSpeed: 2,
            size: 6,
            piercing: 999  // Shuriken bleiben immer bestehen
        }
    },

    thunderstrike: {
        type: "thunderstrike",
        name: "Thunderstrike",
        dmg: 5,
        cooldown: 400,
        range: 300,
        piercing: 0,
        isSpecial: true,  // Nutzt ThunderstrikeWeapon Klasse (eigene shoot() Logik)
        projectileConfig: {
            lightningLength: 300,//?
            lightningDuration: 150, //?
            lightningCount: 4 //? amount?
        }
    },

    //garlic
    aura: {
        type: "aura",
        name: "Aura",
        dmg: 15,
        cooldown: 0.5,  // Passive Waffe
        range: 150,
        piercing: 0,
        isSpecial: true,  // Nutzt AuraWeapon Klasse (passive Logik)
        projectileConfig: {
            auraRadius: 150,
            auraDmgInterval: 500,
            auraColor: 'rgba(255, 255, 100, 0.3)'
        }
    },
        // ENEMY WEAPON
    basicEnemy: {
        type: "basicEnemy",
        name: "Basic Gun",
        dmg: 10,
        cooldown: 300,
        range: 1000,
        piercing: 1,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 3,
            size: 6,
            duration: 3000,
            isEnemy: true
        }
    },

};




/**
 * Hole Waffen-Konfiguration nach Typ
 */
export function getWeaponConfig(type) {
    return WEAPONS[type];
}

/**
 * Erstelle Projectile-Konfiguration aus Weapon-Config
 * Wird vom Weapon beim shoot() aufgerufen
 */
export function createProjectileConfig(weaponConfig, shooter, target, direction, timelength, gridWidth) {
    const config = { ...weaponConfig.projectileConfig };
    config.dmg = weaponConfig.dmg;
    config.piercing = weaponConfig.piercing;
    config.shooter = shooter;
    config.target = target;
    config.direction = direction;
    config.tilelength = timelength;
    config.gridWidth = gridWidth;
    return config;
}

