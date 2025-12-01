import { Entity } from "./entity.js";
export class MovingEntity extends Entity{

    constructor(globalEntityX, globalEntityY, hp, png, speed, hitbox) {
        super(globalEntityX, globalEntityY, hitbox, png);
        this.globalEntityX = globalEntityX;
        this.globalEntityY = globalEntityY;
        this.hp = hp;
        this.maxHp = hp; // MaxHP entspricht Startwert
        this.png = png;
        this.speed = speed;
        this.hitbox = hitbox;
    }

    // Prüft, ob zwei Entities kollidieren (AABB-Kollision)
    
    checkCollision(other) {
        const pLeft = this.globalEntityX;
        const pTop = this.globalEntityY;
        const pRight = pLeft + this.hitbox;
        const pBottom = pTop + this.hitbox;

        const eLeft = other.globalEntityX;
        const eTop = other.globalEntityY;
        const eRight = eLeft + other.hitbox.width;
        const eBottom = eTop + other.hitbox.height;

        if (pRight < eLeft) return false
        if (pLeft > eRight) return false
        if (pBottom < eTop) return false
        if (pTop > eBottom) return false

        return true
    }

    /*export function checkPlayerEnemyCollision(player, enemy) {
        const pLeft = this.globalEntityX;
        const pTop = this.globalEntityY;
        const pRight = pLeft + this.hitbox;
        const pBottom = pTop + this.hitbox;

        const eLeft = other.globalEntityX;
        const eTop = other.globalEntityY;
        const eRight = eLeft + other.hitbox.width;
        const eBottom = eTop + other.hitbox.height;

        if (pRight < eLeft) return false
        if (pLeft > eRight) return false
        if (pBottom < eTop) return false
        if (pTop > eBottom) return false

        return true
    }*/

    // Schadensfunktion: reduziert HP und gibt Status + aktuelle HP zurück
    takeDmg(amount) {
        this.hp -= amount;

        if (this.hp <= 0) {
            this.hp = 0;
            this.die?.(); // optional: Subklasse kann die() definieren
            return { dead: true, hp: this.hp };
        }

        return { dead: false, hp: this.hp };
    }

    die() { // Platzhalter, kann in Subklassen überschrieben werden
    }
}