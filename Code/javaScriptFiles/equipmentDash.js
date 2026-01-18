import { Equipment } from "./equipment.js";

export class EquipmentDash extends Equipment {

    static dashTrails = [];

    constructor() {
        super("dash_icon.png", "Allows a quick dodge move", "dash_picture.png", "Dash", null, 0);
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

            // Startposition merken
            const startX = player.globalEntityX;
            const startY = player.globalEntityY;

            this.performDash(player, map, inputState);

            // Endposition nach dem Dash
            const endX = player.globalEntityX;
            const endY = player.globalEntityY;

            // Trail-Daten in die STATISCHE Liste pushen
            if (startX !== endX || startY !== endY) {
                EquipmentDash.dashTrails.push({
                    startX, startY, endX, endY, alpha: 0.6
                });
            }
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