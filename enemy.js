class enemy extends entity { 

    globalX
    globalY
    hppng
    speed
    hitboxlevel
    xpDrop
    elite
    
    constructor(globalX, globalY, hp, png, speed, hitbox, level, xpDrop, elite){
        super(globalX, globalY, hp, png, speed, hitbox)
        this.level = level
        this.xpDrop = xpDrop
        this.elite = elite
    }

    chasePlayer() {

    }

    draw() {

    }
}