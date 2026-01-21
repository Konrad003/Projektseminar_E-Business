import {Equipment} from "../equipment.js";

export class EquipmentInvincibility extends Equipment { //Invinsibille
    constructor(icon, description, level, name, playerStatKey, valuePerLevel) {
        super(icon, description, level, name, playerStatKey, valuePerLevel);
        this.level = 1;
        this.baseDuration = 8000; // 8 Sekunden Basiszeit (in Millisekunden)
        this.durationPerLevel = 2000; // +2 Sekunden pro Level
        this.activeTimeout = null;
    }

    update(player, map, inputState) {
        // prüfen nur, ob sich das Level geändert hat
        let targetLevel = this.level;

        if (this.currentAppliedLevel !== targetLevel) {
            this.apply(player, targetLevel);
        }
    }

    apply(player, newLevel) {
        // Falls bereits eine Aura läuft, Timer löschen (um Überlappungen zu vermeiden)
        if (this.activeTimeout) {
            clearTimeout(this.activeTimeout);
        }

        // Unbesiegbarkeit aktivieren
        player.isInvincible = true;

        // Level 1 = 8s, Level 2 = 10s, Level 3 = 12s...
        const currentDuration = this.baseDuration + (newLevel - 1) * this.durationPerLevel;

        console.log(`[Holy Aura] Aktiviert für ${currentDuration / 1000} Sekunden (Level ${newLevel})`);

        // Timer setzen, um Unbesiegbarkeit nach Ablauf der Zeit zu deaktivieren
        this.activeTimeout = setTimeout(() => {
            player.isInvincible = false;
            this.activeTimeout = null;
            console.log("[Holy Aura] Abgelaufen.");
        }, currentDuration);

        this.currentAppliedLevel = newLevel;
    }
}