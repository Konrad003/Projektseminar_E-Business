class  map {    
    mapWidthTile = 111 //in Kacheln/Tile (Muss ungerade sein solange wir in dem Karo muster sind)
    mapHightTile = 50 //in Kacheln/Tile
    tilelength = 32
    leftBorder = playerGlobalMapX - FOV / 2
    topBorder = playerGlobalMapY - FOV / 2
    rightBorder = playerGlobalMapX + FOV / 2
    bottomBorder = playerGlobalMapY + FOV / 2
    tileRow = Math.floor(topBorder / Tilelength)
    tileColumn = Math.floor(leftBorder / Tilelength)
    tilePicture = "-----.json" 

    constructor(mapWidthTile, mapHightTile, tilelength) {
        mapWidthTile = mapWidthTile
        this.mapHightTile = mapHightTile
        this.tilelength = tilelength
    }

    drawSquare(x, y, width, height, color) {
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = color;
    ctx.stroke();
    }

    draw() {

    }
}