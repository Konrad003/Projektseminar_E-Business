import { Player } from "./player.js";
export class Map {
  
    constructor(mapWidthTile, mapHeightTile, tilelength, FOV, ctx, mapDataTiles) {
        this.mapWidthTile = mapWidthTile
        this.mapHeightTile = mapHeightTile
        this.tilelength = tilelength
        this.FOV = FOV
        this.ctx = ctx
        this.mapDataTiles = mapDataTiles
        this.tilesetImage = new Image();
        this.tilesLoaded= false
        this.tilesetImage.onload = () => {
            this.tilesLoaded = true;
            this.tilesPerRow= Math.round(this.tilesetImage.width / this.tilelength)-1
            
        };
        this.tilesetImage.src = './Graphics/terrain_tiles_v2.png'; 
    }

    isTileOutOfBorder(tileColumnWalker, tileRowWalker) {
    return (
        tileColumnWalker < 0 || tileColumnWalker >= this.mapWidthTile ||
        tileRowWalker < 0 || tileRowWalker >= this.mapHeightTile
    );
}

    getTileNr(column, row) {
       
        return row * this.mapWidthTile + column /* jedes Tile/Kachel hat eine eigene Nr  nach dem Prinzip    1  2   3   4
                                                                                                                            5  6   7   8
                                                                                                                            9  10  11  12  */
    
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
         
        
        for (let i = this.offsetToBorder(this.leftBorder); i < this.FOV; i += this.tilelength) { 
            this.tileColumnWalker++
            if (!(this.isTileOutOfBorder(this.tileColumnWalker, this.tileRowWalker))) {                                        // obere Reihe an Tiles
            const tileSetNr=this.mapDataTiles[this.getTileNr(this.tileColumnWalker, this.tileRowWalker) ]
            
            this.tileSetX=(tileSetNr%this.tilesPerRow)*this.tilelength
            this.tileSetY=(Math.floor(tileSetNr/this.tilesPerRow) * this.tilelength)+(this.tilelength-this.offsetToBorder(this.topBorder))

            this.ctx.drawImage( this.tilesetImage,
                                this.tileSetX,
                                this.tileSetY, 
                                this.tilelength, 
                                this.offsetToBorder(this.topBorder)  ,
                                i ,
                                0 ,
                                this.tilelength, 
                                this.offsetToBorder(this.topBorder))
                                //obere Tiles(nicht immer vollständig sichtbar)
            }
        }
        //console.log((this.tilelength-this.offsetToBorder(this.topBorder)))
        for (let i = this.offsetToBorder(this.topBorder); i < this.FOV; i += this.tilelength) {
            this.tileRowWalker++                                                                   //Zeilensprung
            this.tileColumnWalker = this.tileColumn
            if (!(this.isTileOutOfBorder(this.tileColumnWalker, this.tileRowWalker))) {
            const tileSetNr=this.mapDataTiles[this.getTileNr(this.tileColumnWalker, this.tileRowWalker)]
            this.tileSetX=(tileSetNr%this.tilesPerRow)*this.tilelength+(this.tilelength-this.offsetToBorder(this.leftBorder))
            this.tileSetY=(Math.floor(tileSetNr/this.tilesPerRow) * this.tilelength)
            this.ctx.drawImage( this.tilesetImage,
                                this.tileSetX,
                                this.tileSetY, 
                                this.offsetToBorder(this.leftBorder), 
                                this.tilelength, 
                                0 , 
                                i , 
                                this.offsetToBorder(this.leftBorder), 
                                this.tilelength)      //linke Tiles(nicht immer vollständig Sichtbar)
            }
            for (let j = this.offsetToBorder(this.leftBorder); j < this.FOV; j += this.tilelength) {
                this.tileColumnWalker++  
                if (!(this.isTileOutOfBorder(this.tileColumnWalker, this.tileRowWalker))) {                                               //nächste Spalte
                const tileSetNr=this.mapDataTiles[this.getTileNr(this.tileColumnWalker, this.tileRowWalker)]
                this.tileSetX=(tileSetNr%this.tilesPerRow)*this.tilelength
                this.tileSetY=(Math.floor(tileSetNr/this.tilesPerRow) * this.tilelength)
                this.ctx.drawImage(this.tilesetImage,this.tileSetX,this.tileSetY, this.tilelength, this.tilelength, j , i , this.tilelength, this.tilelength)                         //innere Tiles(vollständig Sichtbare)
                }
            }
            this.tileColumnWalker++              //nächste Spalte
        }   
        //console.log(this.offsetToBorder(this.topBorder))
        //this.ctx.drawImage(this.tilesetImage,this.tileSetX,this.tileSetY)
    }
}
