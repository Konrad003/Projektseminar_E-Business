import {
    BasicProjectile, FireballProjectile, MolotovProjectile,
    OrbitingProjectile, BoomerangProjectile
} from '../projectiles/index.js';

/**
 * WAFFEN-LEVEL-SYSTEM
 * Level 0 = Waffe noch nicht freigeschaltet
 * Level 1-8 = Aktive Waffe mit steigenden Stats
 *
 * Jede Waffe hat:
 * - baseStats: Grundwerte bei Level 1
 * - levelBonuses: Was pro Level dazukommt
 * - maxLevel: Maximales Level (Standard: 20)
 */

/**
 * Level-Bonus-Definitionen pro Waffe
 * Definiert wie sich Stats pro Level erhöhen
 */
export const WEAPON_LEVEL_BONUSES = {
    bow: {
        dmg: 15,           // +15 Schaden pro Level
        cooldown: -50,     // -50ms Cooldown pro Level
        piercing: 0.5,     // +1 Piercing alle 2 Level
        range: 50,         // +50 Range pro Level
        projectileAmount: 0 // Keine Extra-Projektile
    },
    knife: {
        dmg: 8,
        cooldown: -30,
        piercing: 0.25,    // +1 Piercing alle 4 Level
        range: 30,
        projectileAmount: 0.5  // +1 Messer alle 2 Level
    },
    fireball: {
        dmg: 20,
        cooldown: -100,
        piercing: 0,
        range: 100,
        projectileAmount: 0,
        explosionRadius: 15  // +15 Explosionsradius pro Level
    },
    molotov: {
        dmg: 5,
        cooldown: -80,
        piercing: 0,
        range: 50,
        projectileAmount: 0.33,  // +1 Molotov alle 3 Level
        dotRadius: 10,
        dotDmg: 5
    },
    axe: {
        dmg: 25,
        cooldown: -100,
        piercing: 0,       // Schon unendlich
        range: 50,
        projectileAmount: 0.5,  // +1 Axt alle 2 Level
        maxRange: 50       // +50 Flugweite pro Level
    },
    shuriken: {
        dmg: 5,
        cooldown: -10,
        piercing: 0,       // Schon unendlich
        range: 50,
        projectileAmount: 0.5,  // +1 Shuriken alle 2 Level
        orbitRadius: 15,
        orbitSpeed: 0.2
    },
    thunderstrike: {
        dmg: 3,
        cooldown: -30,
        piercing: 0,
        range: 30,
        projectileAmount: 0,
        lightningLength: 30,
        lightningCount: 0.5  // +1 Blitz alle 2 Level
    },
    aura: {
        dmg: 3,
        cooldown: 0,
        piercing: 0,
        range: 20,
        projectileAmount: 0,
        auraRadius: 20,
        auraDmgInterval: -30  // Schnellerer Tick
    }
};

/**
 * Struktur: {
 *   type: "bow",
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
export const WEAPONS = {
    //basic weapon player
    basic: {
        type: "basic",
        name: "Basic Gun",
        dmg: 10,
        cooldown: 500,
        range: 800,
        piercing: 0,
        maxLevel: 20,  // Für Testing: upgradebar
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
        maxLevel: 20,
        startLevel: 1,  // Spieler startet mit Bow Level 1
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 6,
            size: 6,
            duration: 3000,
            amount: 1  // Basis-Anzahl Projektile
        }
    },

    knife: {
        type: "knife",
        name: "Knife",
        dmg: 40,
        cooldown: 400,
        range: 600,
        piercing: 0,
        maxLevel: 20,
        useFacingDirection: true,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 8,
            size: 5,
            duration: 2000,
            amount: 1
        }
    },

    fireball: {
        type: "fireball",
        name: "Fireball",
        dmg: 100,
        cooldown: 1500,
        range: 1500,
        piercing: 0,
        maxLevel: 20,
        projectile: FireballProjectile,
        projectileConfig: {
            speed: 5,
            size: 8,
            duration: 3000,
            explosionRadius: 100,
            explosionColor: 'rgba(255, 50, 0, 0.9)',
            amount: 1
        }
    },

    molotov: {
        type: "molotov",
        name: "Molotov",
        dmg: 25,
        cooldown: 1200,
        range: 1500,
        piercing: 0,
        maxLevel: 20,
        projectile: MolotovProjectile,
        projectileConfig: {
            speed: 200,
            size: 8,
            flightDuration: 1000,
            dotRadius: 100,
            dotDmg: 25,
            dotInterval: 500,
            amount: 1
        }
    },

    axe: {
        type: "axe",
        name: "Axe",
        dmg: 150,
        cooldown: 1500,
        range: 600,
        piercing: 999,
        maxLevel: 20,
        isSpecial: true,
        projectile: BoomerangProjectile,
        projectileConfig: {
            speed: 8,
            size: 10,
            maxRange: 400,
            piercing: 999,
            amount: 1
        }
    },

    // SPECIAL WEAPONS (mit Custom-Logik)

    shuriken: {
        type: "shuriken",
        name: "Shuriken",
        dmg: 25,
        cooldown: 150,
        range: 700,
        piercing: 999,
        maxLevel: 20,
        isSpecial: true,
        projectile: OrbitingProjectile,
        projectileConfig: {
            amount: 2,  // Basis: 3 Shuriken
            orbitRadius: 100,
            orbitSpeed: 2,
            size: 6,
            piercing: 999
        }
    },

    thunderstrike: {
        type: "thunderstrike",
        name: "Thunderstrike",
        dmg: 5,
        cooldown: 400,
        range: 300,
        piercing: 0,
        maxLevel: 20,
        isSpecial: true,
        projectileConfig: {
            lightningLength: 300,
            lightningDuration: 150,
            lightningCount: 2
        }
    },

    aura: {
        type: "aura",
        name: "Aura",
        dmg: 15,
        cooldown: 0.5,
        range: 150,
        piercing: 0,
        maxLevel: 20,
        isSpecial: true,
        projectileConfig: {
            auraRadius: 150,
            auraDmgInterval: 500,
            auraColor: 'rgba(255, 255, 100, 0.3)'
        }
    },

    // ENEMY WEAPON (nicht upgradebar) - Schwächer als Player-Bogen
    basicEnemy: {
        type: "basicEnemy",
        name: "Enemy Arrow",
        dmg: 15,
        cooldown: 1500,      // Langsamer als Player
        range: 600,          // Kürzere Reichweite
        piercing: 0,
        maxLevel: 1,
        projectile: BasicProjectile,
        projectileConfig: {
            speed: 4,        // Langsamer als Player-Projektile
            size: 5,
            duration: 2000,
            isEnemy: true
        }
    },
};

/**
 * Berechne Stats für eine Waffe bei gegebenem Level
 * @param {string} type - Waffen-Typ
 * @param {number} level - Aktuelles Level (0 = nicht freigeschaltet)
 * @returns {object} - Berechnete Stats oder null wenn Level 0
 */
export function getWeaponStatsForLevel(type, level) {
    const baseConfig = WEAPONS[type];
    if (!baseConfig) return null;

    // Level 0 = Waffe nicht freigeschaltet
    if (level <= 0) return null;

    const bonuses = WEAPON_LEVEL_BONUSES[type] || {};
    const levelMultiplier = level - 1;  // Level 1 = keine Boni

    // Berechne Haupt-Stats
    const stats = {
        ...baseConfig,
        dmg: Math.floor(baseConfig.dmg + (bonuses.dmg || 0) * levelMultiplier),
        cooldown: Math.max(100, baseConfig.cooldown + (bonuses.cooldown || 0) * levelMultiplier),
        range: baseConfig.range + (bonuses.range || 0) * levelMultiplier,
        piercing: Math.floor(baseConfig.piercing + (bonuses.piercing || 0) * levelMultiplier),
        level: level
    };

    // Berechne Projectile-Config mit Level-Boni
    stats.projectileConfig = { ...baseConfig.projectileConfig };

    // Projektil-Anzahl berechnen
    const baseAmount = baseConfig.projectileConfig.amount || 1;
    const bonusAmount = Math.floor((bonuses.projectileAmount || 0) * levelMultiplier);
    stats.projectileConfig.amount = baseAmount + bonusAmount;

    // Spezielle Boni für bestimmte Waffen
    if (bonuses.explosionRadius && stats.projectileConfig.explosionRadius) {
        stats.projectileConfig.explosionRadius += bonuses.explosionRadius * levelMultiplier;
    }
    if (bonuses.dotRadius && stats.projectileConfig.dotRadius) {
        stats.projectileConfig.dotRadius += bonuses.dotRadius * levelMultiplier;
    }
    if (bonuses.dotDmg && stats.projectileConfig.dotDmg) {
        stats.projectileConfig.dotDmg += bonuses.dotDmg * levelMultiplier;
    }
    if (bonuses.maxRange && stats.projectileConfig.maxRange) {
        stats.projectileConfig.maxRange += bonuses.maxRange * levelMultiplier;
    }
    if (bonuses.orbitRadius && stats.projectileConfig.orbitRadius) {
        stats.projectileConfig.orbitRadius += bonuses.orbitRadius * levelMultiplier;
    }
    if (bonuses.orbitSpeed && stats.projectileConfig.orbitSpeed) {
        stats.projectileConfig.orbitSpeed += bonuses.orbitSpeed * levelMultiplier;
    }
    if (bonuses.lightningLength && stats.projectileConfig.lightningLength) {
        stats.projectileConfig.lightningLength += bonuses.lightningLength * levelMultiplier;
    }
    if (bonuses.lightningCount && stats.projectileConfig.lightningCount) {
        stats.projectileConfig.lightningCount += Math.floor(bonuses.lightningCount * levelMultiplier);
    }
    if (bonuses.auraRadius && stats.projectileConfig.auraRadius) {
        stats.projectileConfig.auraRadius += bonuses.auraRadius * levelMultiplier;
    }
    if (bonuses.auraDmgInterval && stats.projectileConfig.auraDmgInterval) {
        stats.projectileConfig.auraDmgInterval = Math.max(100,
            stats.projectileConfig.auraDmgInterval + bonuses.auraDmgInterval * levelMultiplier);
    }

    // Piercing auch in projectileConfig
    stats.projectileConfig.piercing = stats.piercing;

    return stats;
}

/**
 * Hole Waffen-Konfiguration nach Typ (Basis-Stats ohne Level)
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

