const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

// Tastatur inputs:
let upPressed = false
let leftPressed = false
let rightPressed = false
let downPressed = false

// Map Variablen
mapWidthTile=111 //in Kacheln/Tile (Muss ungerade sein solange wir in dem Karo muster sind)
mapHeightTile=50 //in Kacheln/Tile
Tilelength=32
playerGlobalMapX=mapWidthTile*Tilelength/2
playerGlobalMapY=mapHeightTile*Tilelength/2
FOV=canvas.height //Field of View in px

function playerMovement(){  //Je nachdem welche Taste grade gedrückt wird
  if(upPressed) playerGlobalMapY--
  if(downPressed) playerGlobalMapY++
  if(rightPressed) playerGlobalMapX++
  if(leftPressed) playerGlobalMapX--
}
function render(){ // Hauptfunktion für alle Funktionen die für die Frames des Spielen sind wie drawMap oder drawPlayer etc.
    playerMovement()
    drawMapinRange(playerGlobalMapX, playerGlobalMapY)
}
function getTileNr(){
    return tileRow*mapWidthTile+tileColumnWalker /* jedes Tile/Kachel hat eine eigene Nr  nach dem Prinzip 1 2  3  4
                                                                                                           5 6  7  8
                                                                                                           9 10 11 12  */
}
function keyDownHandler(e) { // liest Input der Tastur aus
    if ((e.key == "ArrowUp") || (e.key =='w')) {
        upPressed = true;
    }
    if ((e.key == "ArrowLeft") || (e.key =='a')) {
        leftPressed = true;
    }
    if ((e.key == "ArrowRight") || (e.key =='d')) {
        rightPressed = true;
    }
    if ((e.key == "ArrowDown") || (e.key =='s')) {
        downPressed = true;
    }
}
function keyUpHandler(e) { // liest Output der Tastatur aus
    if ((e.key == "ArrowUp") || (e.key =='w')) {
        upPressed = false;
    }
    if ((e.key == "ArrowLeft") || (e.key =='a')) {
        leftPressed = false;
    }
    if ((e.key == "ArrowRight") || (e.key =='d')) {
        rightPressed = false;
    }
    if ((e.key == "ArrowDown") || (e.key =='s')) {
        downPressed = false;
    }
}
function drawSquare(x, y,width,height, color) {
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = color;
    ctx.stroke();
}
function isTileOutOfBorder(){
    return (tileColumnWalker<=0||tileColumnWalker>=mapWidthTile||tileRow<=0||tileRow>=mapHeightTile)
}
function drawMapinRange(playerGlobalMapX, playerGlobalMapY){ //zeichnet die sichtbare Map 
        tileNr=0
        leftBorder=playerGlobalMapX-FOV/2
        topBorder=playerGlobalMapY-FOV/2
        rightBorder=playerGlobalMapX+FOV/2
        bottomBorder=playerGlobalMapY+FOV/2
        tileRow=Math.floor(topBorder/Tilelength)
        tileColumn=Math.floor(leftBorder/Tilelength)
        tileColumnWalker=tileColumn

        drawSquare(0,0,Tilelength-(leftBorder%Tilelength),Tilelength-(topBorder%Tilelength),'Yellow')   //erstes Tile oben links
        for (i=Tilelength-(leftBorder%Tilelength);i<FOV;i+=Tilelength){                                 // obere Reihe an Tiles
            tileColumnWalker++
            if(isTileOutOfBorder()) 
                color='brown'                                            //Wieder auf die richitge Spalte gesetzt
            else if (getTileNr()%2==0)
                    color='black'                                           //linke Tiles(nicht immer vollständig Sichtbar)
                else 
                    color='green'
            drawSquare(i,0,Tilelength,Tilelength-(topBorder%Tilelength),color)

        }

        for (i=Tilelength-(topBorder%Tilelength);i<FOV;i+=Tilelength){
            tileRow++                                                                   //Zeilensprung
            tileColumnWalker=tileColumn
            if(isTileOutOfBorder()) 
                color='brown'                                            //Wieder auf die richitge Spalte gesetzt
            else if (getTileNr()%2==0)
                    color='black'                                           //linke Tiles(nicht immer vollständig Sichtbar)
                else 
                    color='green'
                drawSquare(0,i,Tilelength-(leftBorder%Tilelength),Tilelength,color)
            
            for (j=Tilelength-(leftBorder%Tilelength);j<FOV;j+=Tilelength){             
                tileColumnWalker++
                if(isTileOutOfBorder()) 
                    color='brown'                                                    //nächste Spalte
                else if (getTileNr()%2==0)
                        color='black'               //innere Tiles(vollständig Sichtbare)
                    else 
                        color='green'
                drawSquare(j,i,Tilelength,Tilelength,color)
            }
            tileColumnWalker++                                                          //nächste Spalte   
        }
    }
class Player {
    //Koordinaten liegen bisher in Map.playerGlobalX / Y
    level=0
    constructor(hp, baseDamage, hitbox, firstWeapon,speed,range){
        this.hp=hp
        this.baseDamage=baseDamage
        this.hitbox=hitbox
        this.firstWeapon=firstWeapon
        this.speed=speed
        this.range=range
    }

    playerMovement(){
        if (upPressed){
            playerGlobalMapY-=this.speed
        }
        if (downPressed){
            playerGlobalMapY+=this.speed
        }
        if (rightPressed){
            playerGlobalMapX+=this.speed
        }
        if (leftPressed){
            playerGlobalMapX-=this.speed
        }


    }
    takeDamage(){

    }
    levelUp(){

    }
    draw(){

    }
}

class Map {


}
drawSquare(0,0,canvas.width,canvas.height,'gray')
setInterval(render, 5)
