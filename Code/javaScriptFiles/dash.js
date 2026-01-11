import { Equipment } from "./equipment.js";

export class Dash extends Equipment {
    constructor() {
        super("Dash", "dash_icon.png");
        this.cooldown = 0;
        this.dashDuration = 10; // Wie viele Frames der Dash dauert
        this.isDashing = false;
    }

    update(player, map, inputState) {
        // Cooldown verringern
        if (this.cooldown > 0) this.cooldown--;

        // Dash auslösen (nur wenn Leertaste gedrückt, kein Cooldown und nicht bereits im Dash)
        // Wir nutzen hier testweise die Leertaste (spacePressed), die wir später im inputState brauchen
        if (inputState.spacePressed && this.cooldown <= 0) {
            this.cooldown = 60; // 1 Sekunde bei 60 FPS
            this.isDashing = true;
        }

        if (this.isDashing) {
            this.performDash(player, map, inputState);
        }
    }

    performDash(player, map, inputState) {
        let dashDistance = 160; // Geschwindigkeit während des Dashes
        
        // Dash in die Richtung, die gedrückt wird
        if (inputState.rightPressed) {
            player.globalEntityX = map.rightFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
        }
        if (inputState.upPressed) {
            player.globalEntityY = map.topFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
        }
        if (inputState.leftPressed) {
            player.globalEntityX = map.leftFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
        }
        if (inputState.downPressed) {
            player.globalEntityY = map.downFree(player.globalEntityX, player.globalEntityY, dashDistance, player.hitbox);
        }

        // Nach einer kurzen Zeit den Dash-Status beenden
        // (Einfachheitshalber hier sofort nach der Bewegung, 
        // für längere Dashes müsste man einen Counter einbauen)
        this.isDashing = false; 
    }
}