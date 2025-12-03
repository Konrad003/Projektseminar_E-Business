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
    
    checkCollision(other, proposedMoveX, proposedMoveY) {
        return (this.checkCollisionHorizontal(other, proposedMoveX) &&
                this.checkCollisionVertical(other, proposedMoveY))
    }
    checkCollisionHorizontal(other, proposedMoveX){
        const aLeft = this.globalEntityX + proposedMoveX        // mir geplanter bewegung
        const aRight = aLeft + this.hitbox.width
        const bLeft = other.globalEntityX
        const bRight = bLeft + other.hitbox.width

        const aTop = this.globalEntityY                         // ohne geplante bewegung
        const aBottom = aTop + this.hitbox.height
        const bTop = other.globalEntityY
        const bBottom = bTop + other.hitbox.height

        if (!((aBottom > bTop) && (aTop < bBottom))) return false // keine vertikale Überschneidung --> keine horizontale Kollision
        if (aRight <= bLeft) return false                           // Prüfe ob horizontale Überschneidung
        if (aLeft >= bRight) return false                           // Prüfe ob horizontale Überschneidung
        return true //Keine Überschneidung
    }
        

    checkCollisionVertical(other, proposedMoveY){
        const aTop = this.globalEntityY + proposedMoveY        // mir geplanter bewegung
        const aBottom = aTop + this.hitbox.height
        const bTop = other.globalEntityY
        const bBottom = bTop + other.hitbox.height

        const aLeft = this.globalEntityX                         // ohne geplante bewegung
        const aRight = aLeft + this.hitbox.width
        const bLeft = other.globalEntityX
        const bRight = bLeft + other.hitbox.width

        if (!((aRight > bLeft) && (aLeft < bRight))) return false; // keine horizontale Überschneidung --> keine vertikale Kollision
        if (aBottom <= bTop) return false                           // Prüfe ob vertikale Überschneidung
        if (aTop >= bBottom) return false                           // Prüfe ob vertikale Überschneidung
        return true //keine Überschneidung
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