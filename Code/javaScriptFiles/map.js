import { Player } from "./player.js";
export class Map {
    mapWidthTile //in Kacheln/Tile (Muss ungerade sein, solange wir in dem Karo muster sind)
    mapHeightTile //in Kacheln/Tile
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
    map1
    mapDataTiles
    constructor(mapWidthTile, mapHeightTile, tilelength, FOV, ctx, mapDataTiles) {
        this.mapWidthTile = mapWidthTile
        this.mapHeightTile = mapHeightTile
        this.tilelength = tilelength
        this.FOV = FOV
        this.ctx = ctx
        this.mapDataTiles = mapDataTiles
        console.log(this.tilelength)
    }

    

    loadTile(tileNr){
        console.log("TileNr: ")
        if(this.mapDataTiles[tileNr]<0 || this.mapDataTiles[tileNr]>this.mapWidthTile) return 'brown'
        if(this.mapDataTiles[tileNr]==0) return 'black'
        if(this.mapDataTiles[tileNr]==1) return 'green'
        if(this.mapDataTiles[tileNr]==2) return 'yellow'
        if(this.mapDataTiles[tileNr]==3) return 'red'
        if(this.mapDataTiles[tileNr]==4) return 'orange'
        if(this.mapDataTiles[tileNr]==5) return 'gray'
        if(this.mapDataTiles[tileNr]==6) return 'brown'
        if(this.mapDataTiles[tileNr]==7) return 'pink'
        if(this.mapDataTiles[tileNr]==8) return 'white'
        if(this.mapDataTiles[tileNr]==9) return 'blue'
        if(this.mapDataTiles[tileNr]==10) return 'gray'
        if(this.mapDataTiles[tileNr]==11) return 'white'
        

        
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
        return (tileColumnWalker < 0 || tileColumnWalker > this.mapWidthTile || tileRowWalker < 0 || tileRowWalker > this.mapHeightTile)
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
            this.drawSquare(i, 0, this.tilelength, this.offsetToBorder(this.topBorder), this.loadTile(this.getTileNr()))          //obere Tiles(nicht immer vollständig sichtbar)
        }
    
        for (let i = this.offsetToBorder(this.topBorder); i < this.FOV; i += this.tilelength) {
            this.tileRowWalker++                                                                   //Zeilensprung
            this.tileColumnWalker = this.tileColumn
            this.drawSquare(0, i, this.offsetToBorder(this.leftBorder), this.tilelength, this.loadTile(this.getTileNr()))         //linke Tiles(nicht immer vollständig Sichtbar)

                for (let j = this.offsetToBorder(this.leftBorder); j < this.FOV; j += this.tilelength) {
                this.tileColumnWalker++                                                  //nächste Spalte
                this.drawSquare(j, i, this.tilelength, this.tilelength, this.loadTile(this.getTileNr()))                         //innere Tiles(vollständig Sichtbare)
            }
            this.tileColumnWalker++                                                          //nächste Spalte
        }
    }
}
