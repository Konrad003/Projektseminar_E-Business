export class Entity {
    // Basisattribute für jede Spielfigur / jedes Objekt
    globalEntityX;
    globalEntityY;
    hp;
    maxHp;
    png;
    speed;
    hitbox; // { width: number, height: number }

    constructor(playerGlobalX, playerGlobalY, hp, png, speed, hitbox) {
        this.playerGlobalX = playerGlobalX;
        this.playerGlobalY = playerGlobalY;
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

    // Bewegung basierend auf Richtung (dx, dy) und Delta-Time (dt)
    move() {

    }

}
