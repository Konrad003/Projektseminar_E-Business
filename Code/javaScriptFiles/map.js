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
        let tilesLoaded= false
        this.tilesetImage.onload = () => {
         tilesLoaded = true;
            
            this.tilesPerRow= Math.round(this.tilesetImage.width / this.tilelength)
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
       
        return row * this.mapWidthTile + column /* jedes Tile/Kachel hat eine eigene Nr  nach dem Prinzip   1  2   3   4
                                                                                                            5  6   7   8
                                                                                                            9  10  11  12  */
    
    }

    offsetToBorder(offset){
        let holder = (offset % this.tilelength)
        if (holder < 0) return holder * -1;      //holder wird negativ, wenn die Border erreicht wird, da die Koords ins negative gehen. Daher die Lösung mit return holder
         
        return this.tilelength - holder;
    }
    
    drawTile(tileColumnWalker, tileRowWalker, leftBorder, topBorder, i, j) {
        
        i = Math.floor(i);      //subPixelRendering, ohne das gibt es weiße Linien auf dem Canvas
        j = Math.floor(j);  
        if (!(this.isTileOutOfBorder(tileColumnWalker, tileRowWalker))) {                                        
            let tileSetNr = this.mapDataTiles[this.getTileNr(tileColumnWalker, tileRowWalker) ] - 1     //-1 liegt daran dass json Datei falsch geschrieben ist. Map1.Json fängt bei 1 statt 0 an

            let leftOffset = this.tilelength - this.offsetToBorder(leftBorder)      
            let topOffset = (this.tilelength - this.offsetToBorder(topBorder))                                //Wie viel von dem TileSetTile gezeichnet werden muss, falls oben am Bildrand nur die hälft z.B. gezeichnet wurde
            let tileSetX = (tileSetNr % this.tilesPerRow) * this.tilelength + leftOffset                      //Koordinate im TileSet
            let tileSetY = (Math.floor(tileSetNr / this.tilesPerRow) * this.tilelength) + topOffset

        this.ctx.drawImage( this.tilesetImage,                                      //Datei aus der das Tile stammt
                            tileSetX,                                               //X Koordinate im TileSet
                            tileSetY,                                               //Y Koordinate im TileSet
                            this.offsetToBorder(leftBorder),                        //Breite des Ausgeschnittenen Tiles
                            this.offsetToBorder(topBorder),                         //Höhe des Ausgeschnittenen Tiles
                            i,                                                      //X Position im Canvas 
                            j,                                                      //Y Position im Canvas 
                            this.offsetToBorder(leftBorder),                        //Breite im Canvas
                            this.offsetToBorder(topBorder))                         //Höhe im Canvas                     
        }
    }

    draw(playerGlobalX, playerGlobalY) {

        let leftBorder = playerGlobalX - this.FOV / 2
        let topBorder = playerGlobalY - this.FOV / 2
        let tileRow = Math.floor(topBorder / this.tilelength)
        let tileRowWalker = tileRow
        let tileColumn = Math.floor(leftBorder / this.tilelength)
        let tileColumnWalker = tileColumn

        this.drawTile(tileColumnWalker, tileRowWalker,  leftBorder, topBorder, 0, 0)                //Zeichnen des obersten Tiles

        for (let i = this.offsetToBorder(leftBorder); i < this.FOV; i += this.tilelength) {         
            tileColumnWalker++
            this.drawTile(tileColumnWalker, tileRowWalker, 0, topBorder, i, 0)                      //Zeichnen der obersten Reihe
        }

        for (let j = this.offsetToBorder(topBorder); j < this.FOV; j += this.tilelength) {
            tileRowWalker++
            tileColumnWalker = tileColumn                                                                 
            this.drawTile(tileColumnWalker, tileRowWalker, leftBorder, 0, 0, j)                     //Zeichnen der linken Reihe
        
            for (let i = this.offsetToBorder(leftBorder); i < this.FOV; i += this.tilelength) {
                tileColumnWalker++  
                this.drawTile(tileColumnWalker, tileRowWalker, 0, 0, i, j)                          //Zeichnen der inneren Tiles
            }
            tileColumnWalker++          
        }   
    }
}
