export class DropSingleUse  {

    constructor(globalX, globalY) {
        this.globalX = globalX
        this.globalY = globalY
    }

    use() {   // kommt später 
        
    }

    // Item zeichnen als kleines grünes Quadrat
    draw(ctx, leftBorder, topBorder) {
        const screenX = this.globalX - leftBorder
        const screenY = this.globalY - topBorder

        ctx.fillStyle = "pink"
        ctx.fillRect(screenX, screenY, 13, 13)
    }
}
