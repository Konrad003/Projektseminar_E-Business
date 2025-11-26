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
        if (!other || !other.hitbox) return false;

        const thisLeft   = this.globalEntityX;
        const thisRight  = this.globalEntityX + this.hitbox.width;
        const thisTop    = this.globalEntityY;
        const thisBottom = this.globalEntityY + this.hitbox.height;

        const otherLeft   = other.globalEntityX;
        const otherRight  = other.globalEntityX + other.hitbox.width;
        const otherTop    = other.globalEntityY;
        const otherBottom = other.globalEntityY + other.hitbox.height;

        return !(
            thisRight < otherLeft ||
            thisLeft > otherRight ||
            thisBottom < otherTop ||
            thisTop > otherBottom
        );
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