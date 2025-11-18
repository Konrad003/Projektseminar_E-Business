import { Player } from "./player.js";
export class Map {
    mapWidthTile //in Kacheln/Tile (Muss ungerade sein, solange wir in dem Karo muster sind)
    mapHightTile //in Kacheln/Tile
    tilelength=32 //in Pixel
    leftBorder 
    topBorder 
    rightBorder 
    bottomBorder
    tileRow = Math.floor(50 / 32)
    tileColumn = Math.floor(50 / 32)
    tilePicture = "-----.json" 
    FOV
    ctx
    constructor(mapWidthTile, mapHightTile, tilelength, FOV, ctx, playerGlobalX, playerGlobalY) {
        this.mapWidthTile = mapWidthTile
        this.mapHightTile = mapHightTile
        this.tilelength = tilelength
        this.FOV = FOV
        this.ctx = ctx
        this.playerGlobalX = playerGlobalX
        this.playerGlobalY = playerGlobalY
    }

    drawSquare(x, y, width, height, color) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, width, height)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    }

    isTileOutOfBorder(tileColumnWalker, tileRowWalker) {
        return (tileColumnWalker < 0 || tileColumnWalker > this.mapWidthTile || tileRowWalker < 0 || tileRowWalker > this.mapHqightTile)
    }

    getTileNr() {
        return this.tileRowWalker * this.mapWidthTile + this.tileColumnWalker /* jedes Tile/Kachel hat eine eigene Nr  nach dem Prinzip    1  2   3   4
                                                                                                                            5  6   7   8
                                                                                                                            9  10  11  12  */
    }

    getColor(tileColumnWalker, tileRowWalker){
        if(this.isTileOutOfBorder(tileColumnWalker, tileRowWalker))
            return 'brown'
        else if (this.getTileNr() % 2 == 0)
            return 'black'
        else
            return 'green'
    }

    offsetToBorder(offset){
        let holder = (offset % this.tilelength)
        if (holder < 0) return holder * -1;      //holder wird negativ, wenn die Border erreicht wird, da die Koords ins negative gehen. Daher die Lösung mit return holder
         
        return this.tilelength - holder;
    }

    draw(playerGlobalX, playerGlobalY) {
        
        this.leftBorder = playerGlobalX - this.FOV / 2
        this.topBorder = playerGlobalY - this.FOV / 2
        this.rightBorder = playerGlobalX + this.FOV / 2
        this.bottomBorder = playerGlobalY + this.FOV / 2
        this.tileRow = Math.floor(this.topBorder / this.tilelength)
        this.tileRowWalker = this.tileRow
        this.tileColumn = Math.floor(this.leftBorder / this.tilelength)
        this.tileColumnWalker = this.tileColumn
        this.drawSquare(0, 0, this.offsetToBorder(this.leftBorder), this.offsetToBorder(this.topBorder), 'Yellow')   //erstes Tile oben links
        for (let i = this.offsetToBorder(this.leftBorder); i < this.FOV; i += this.tilelength) {                                 // obere Reihe an Tiles
            this.tileColumnWalker++
            this.drawSquare(i, 0, this.tilelength, this.offsetToBorder(this.topBorder), this.getColor(this.tileColumnWalker, this.tileRowWalker))          //obere Tiles(nicht immer vollständig sichtbar)
        }
    
        for (let i = this.offsetToBorder(this.topBorder); i < this.FOV; i += this.tilelength) {
            this.tileRowWalker++                                                                   //Zeilensprung
            this.tileColumnWalker = this.tileColumn
            this.drawSquare(0, i, this.offsetToBorder(this.leftBorder), this.tilelength, this.getColor(this.tileColumnWalker, this.tileRowWalker))         //linke Tiles(nicht immer vollständig Sichtbar)

                for (let j = this.offsetToBorder(this.leftBorder); j < this.FOV; j += this.tilelength) {
                this.tileColumnWalker++                                                  //nächste Spalte
                this.drawSquare(j, i, this.tilelength, this.tilelength, this.getColor(this.tileColumnWalker, this.tileRowWalker))                         //innere Tiles(vollständig Sichtbare)
            }
            this.tileColumnWalker++                                                          //nächste Spalte
        }
    }
}
