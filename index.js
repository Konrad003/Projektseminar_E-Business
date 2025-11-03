const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

// Tastatur inputs:
upPressed = false
leftPressed = false
rightPressed = false
downPressed = false
function render(){ // Haubtfunktion für alle Funktionen die für die Frames des Spielen sind wie drawMap oder drawPlayer etc.
    playerMovement()
    drawMapinRange(playerGlobalMapX, playerGlobalMapY)
}
function keyUpHandler(e) { // liest Input der Tastur aus
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
function keyUpHandler(e) { // liest Output der Tastur aus
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
            playerGlobalMapY-=speed
        }
        if (downPressed){
            playerGlobalMapY+=speed
        }
        if (rightPressed){
            playerGlobalMapX+=speed
        }
        if (leftPressed){
            playerGlobalMapX-=speed
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
    keys = {}
    
    mapWidth=800
    mapHight=200
    playerGlobalMapX=mapWidth/2
    playerGlobalMapY=mapHight/2
    FOV=100 //Field of View
    drawMapinRange(playerGlobalMapX, playerGlobalMapY){
        leftBorder=playerGlobalMapX-FOV/2
        topBorder=playerGlobalMapY-FOV/2
        rightBorder=playerGlobalMapX+FOV/2
        bottomBorder=playerGlobalMapY+FOV/2
    }
}