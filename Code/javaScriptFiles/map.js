import { Player } from "./player.js";
import { Entity } from "./entity.js";

export class Map {
    
    constructor(mapData, FOVwidth, FOVheight, ctx) {
        this.mapWidthTile = mapData.width
        this.mapHeightTile = mapData.height
        this.tilelength = mapData.tilewidth
        this.FOVwidth = FOVwidth
        this.FOVheight = FOVheight
        this.ctx = ctx
        this.mapDataTiles = mapData.layers
        this.map1Image = new Image()
        this.map1Loaded= false
        this.tilesetImage = new Image()
        this.tilesLoaded= false
        this.tileData=[]
        this.map1Image.onload= () =>  {
            this.map1Loaded= true
        }
        this.tilesetImage.onload = () => {
            this.tilesLoaded = true;
            this.tilesPerRow= Math.round(this.tilesetImage.width / this.tilelength)
            this.loadTileData()
            
            
        };

        this.tilesetImage.src = 'Graphics/terrain_tiles_v2.png'
        this.map1Image.src = 'Graphics/map1.png'
    }
    maxAbs(x, y) {
    return Math.abs(x) >= Math.abs(y) ? x : y;
    }   
    findTile(x,y){
        let column = Math.floor(x/this.tilelength)
        let row =  Math.floor(y/this.tilelength)
        if (row < 0 || row >= this.mapHeightTile || column < 0 || column >= this.mapWidthTile)
        return { walkable: false, height: 0 };

        if (!this.tileData[row]) {
            return { walkable: false, height: 0 };
        }

        return (this.tileData[row][column])
    }
    checkIfFree(mainEntityKoord, entityX, entityY, moveLengthHoriz, moveLengthVert, mapLengthOrWidth, directionX, directionY){
        let mapLong = mapLengthOrWidth * this.tilelength - this.tilelength
        let mainEntityKoordInt                                                                  // Welche Koordinate bewegt werden soll
        let moveLength = this.maxAbs(moveLengthHoriz, moveLengthVert)
        if (mainEntityKoord=="x") {
            mainEntityKoordInt = entityX
        } else mainEntityKoordInt = entityY

        if (mainEntityKoordInt + moveLength>mapLong) return mapLong                             // MapBorder collision abfrage
        if (mainEntityKoordInt + moveLength<0) return 0

        let mapTile1 = this.findTile(entityX + directionX, entityY + directionY)                // Feld auf dem die jeweils interessierte Ecke ist: left up = NordWest  right = NO Down = SW
        let newMapTile1 = this.findTile(entityX + moveLengthHoriz + directionX, entityY + moveLengthVert + directionY) // Feld auf das sich der Spieler bewegen würde

        let newMapTile2                                                                                               // Feld2 auf das sich der Spieler bewegen würde, Spieler kann auf 2 Feldern stehen und soll sich auch nur dann bewegen wenn die Gesamte Hitbox nicht clippen würde
        if (mainEntityKoord=="x")
            newMapTile2 = this.findTile(entityX + moveLengthHoriz + directionX, entityY + moveLengthVert + directionY + this.tilelength)
        else 
            newMapTile2 = this.findTile(entityX + moveLengthHoriz + directionX + this.tilelength, + entityY + moveLengthVert + directionY)

        if (mapTile1 === newMapTile1 || (newMapTile1.walkable && newMapTile2.walkable)){
            return mainEntityKoordInt+moveLength //Falls die Bewegung erlaubt ist
        }else 
            return mainEntityKoordInt  //Falls man mit der Bewegung in die Wand gehen würde
            
    }
    rightFree(entityX, entityY, moveLength){
        return (this.checkIfFree("x", entityX, entityY,moveLength, 0,  this.mapWidthTile, this.tilelength, 0))
    }

    topFree(entityX, entityY, moveLength){
        return (this.checkIfFree("y", entityX, entityY, 0 , -moveLength, this.mapHeightTile, 0, 0))
    }

    leftFree(entityX, entityY, moveLength){
        return (this.checkIfFree("x", entityX, entityY, -moveLength, 0, this.mapWidthTile, 0, 0))
    }

    downFree(entityX, entityY, moveLength){
        return (this.checkIfFree("y", entityX, entityY, 0, moveLength, this.mapHeightTile, 0, this.tilelength))
    }
    loadTileData(){
        for (let i = 0; i<this.mapHeightTile;i++){
            this.tileData[i] = []
            for (let j = 0; j<this.mapWidthTile;j++){
                let tileSetNr = this.mapDataTiles[0].data[this.getTileNr(i, j) ] -1
                let tileHeight = 0
                let walkable = true
                if (this.mapDataTiles[1].data[this.getTileNr(i, j) ]>0)
                    walkable = false
                else if (this.mapDataTiles[2].data[this.getTileNr(i, j) ]>0)
                    tileHeight = 1
                else if (this.mapDataTiles[3].data[this.getTileNr(i, j ) ]>0)
                    tileHeight = 2
                this.tileData[i][j] = {
                walkable: walkable,
                height: tileHeight,
                tileSetX: (tileSetNr % this.tilesPerRow) * this.tilelength,
                tileSetY: (Math.floor(tileSetNr / this.tilesPerRow) * this.tilelength),
                tileMapX: j * this.tilelength,
                tileMapY: i * this.tilelength
                }
                this.tileData[i][j]
            }
        }
    }


    isTileOutOfBorder(tileRowWalker, tileColumnWalker, ) {
    return (
        tileColumnWalker < 0 || tileColumnWalker >= this.mapWidthTile ||
        tileRowWalker < 0 || tileRowWalker >= this.mapHeightTile
    );
    }

    getTileNr(row, column) {
       
        return row * this.mapWidthTile + column /* jedes Tile/Kachel hat eine eigene Nr  nach dem Prinzip   1  2   3   4
                                                                                                            5  6   7   8
                                                                                                            9  10  11  12  */
    
    }

    offsetToBorder(offset){
        let holder = (offset % this.tilelength)
        if (holder < 0) return holder * -1;      //holder wird negativ, wenn die Border erreicht wird, da die Koords ins negative gehen. Daher die Lösung mit return holder
         
        return this.tilelength - holder;
    }
    
    drawTile(tileRowWalker, tileColumnWalker, leftBorder, topBorder, i, j) {
        
        i = Math.floor(i);      //subPixelRendering, ohne das gibt es weiße Linien auf dem Canvas
        j = Math.floor(j);  
        if (!(this.isTileOutOfBorder(tileRowWalker, tileColumnWalker))) {   
            let leftOffset = this.tilelength - this.offsetToBorder(leftBorder)      
            let topOffset = (this.tilelength - this.offsetToBorder(topBorder))                                //Wie viel von dem TileSetTile gezeichnet werden muss, falls oben am Bildrand nur die hälft z.B. gezeichnet wurde
            this.ctx.drawImage( this.tilesetImage,                                      //Datei aus der das Tile stammt
                                this.tileData[tileRowWalker][tileColumnWalker].tileSetX + leftOffset,                                               //X Koordinate im TileSet
                                this.tileData[tileRowWalker][tileColumnWalker].tileSetY + topOffset,                                               //Y Koordinate im TileSet
                                this.offsetToBorder(leftBorder),                        //Breite des Ausgeschnittenen Tiles
                                this.offsetToBorder(topBorder),                         //Höhe des Ausgeschnittenen Tiles
                                i,                                                      //X Position im Canvas 
                                j,                                                      //Y Position im Canvas 
                                this.offsetToBorder(leftBorder),                        //Breite im Canvas
                                this.offsetToBorder(topBorder))                         //Höhe im Canvas                     
        }
    }

    draw(player) {
        if (this.map1Loaded && this.tilesLoaded){
            let leftBorder = player.globalEntityX - this.FOVwidth / 2
            let topBorder = player.globalEntityY - this.FOVheight / 2
            let tileRow = Math.floor(topBorder / this.tilelength)
            let tileRowWalker = tileRow
            let tileColumn = Math.floor(leftBorder / this.tilelength)
            let tileColumnWalker = tileColumn
        

        this.drawTile(tileRowWalker, tileColumnWalker,  leftBorder, topBorder, 0, 0)                //Zeichnen des obersten Tiles

        for (let i = this.offsetToBorder(leftBorder); i < this.FOVwidth; i += this.tilelength) {         
            tileColumnWalker++
            this.drawTile(tileRowWalker,tileColumnWalker , 0, topBorder, i, 0)                      //Zeichnen der obersten Reihe
        }

        for (let j = this.offsetToBorder(topBorder); j < this.FOVheight; j += this.tilelength) {
            tileRowWalker++
            tileColumnWalker = tileColumn
            this.drawTile(tileRowWalker, tileColumnWalker , leftBorder, 0, 0, j)                     //Zeichnen der linken Reihe
        
            for (let i = this.offsetToBorder(leftBorder); i < this.FOVwidth; i += this.tilelength) {
                tileColumnWalker++  
                this.drawTile(tileRowWalker, tileColumnWalker, 0, 0, i, j)                          //Zeichnen der inneren Tiles
            }
        }   
      this.drawMiniMap(player)
    }
}
    drawMiniMap(player){
    let multiplier =1
    this.drawSqr(0,0, 72, 92, "black")
    this.ctx.drawImage(this.map1Image,1,1,this.mapWidthTile*multiplier,this.mapHeightTile*multiplier)
    this.drawSqr(player.globalEntityX, player.globalEntityY, 1, 1, "blue")
    
    }
    drawMiniEnemy(enemy){
        this.drawSqr(enemy.globalEntityX , enemy.globalEntityY, 1, 1, "red")
    }
    drawSqr(x, y, width, height, color) {
        let multiplier = 1
        this.ctx.beginPath()
        this.ctx.rect(x/ this.tilelength * multiplier, y / this.tilelength * multiplier, width * multiplier, height * multiplier)
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
}
