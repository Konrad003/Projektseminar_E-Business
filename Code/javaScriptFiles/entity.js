export class Entity {

    globalEntityX
    globalEntityY
    hitbox
    png

    constructor(globalEntityX, globalEntityY, hitbox, png) {
    this.globalEntityX = globalEntityX
    this.globalEntityY = globalEntityY
    this.hitbox = hitbox
    this.png = png
    }

    draw(ctx, x, y, width, height, color) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();    
    }
}