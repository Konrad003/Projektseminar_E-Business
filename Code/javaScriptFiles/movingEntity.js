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
        const aLeft = this.globalEntityX;
        const aTop = this.globalEntityY;
        const aRight = aLeft + this.hitbox;
        const aBottom = aTop + this.hitbox;

        const bLeft = other.globalEntityX;
        const bTop = other.globalEntityY;
        const bRight = bLeft + other.hitbox.width;
        const bBottom = bTop + other.hitbox.height;

        if (aRight < bLeft) return false
        if (aLeft > bRight) return false
        if (aBottom < bTop) return false
        if (aTop > bBottom) return false

        return true
    }

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