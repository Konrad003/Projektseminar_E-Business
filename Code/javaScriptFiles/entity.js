export class Entity {

    globalEntityX
    globalEntityY
    hitbox
    png
    static FOVwidthMiddle
    static FOVheightMiddle
    
    constructor(globalEntityX, globalEntityY, hitbox, png) {
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
        this.hitbox = hitbox
        this.png = png
    }

    draw(ctx, player) {
        let color = this.getColor()
        let leftBorder = player.globalEntityX - Entity.FOVwidthMiddle
        let topBorder = player.globalEntityY - Entity.FOVheightMiddle

        if (this.png && this.png.complete && this.png.naturalWidth !== 0) {
            ctx.drawImage(this.png, this.globalEntityX - leftBorder, this.globalEntityY - topBorder, this.hitbox.width, this.hitbox.height);
        } else {
            ctx.beginPath();
            ctx.rect(this.globalEntityX - leftBorder, this.globalEntityY - topBorder, this.hitbox.width, this.hitbox.height);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
}