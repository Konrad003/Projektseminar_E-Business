import { StaticEntity } from "./staticEntity.js"
export class DropSingleUse extends StaticEntity {

    constructor(globalEntityX, globalEntityY) {
        super(globalEntityX, globalEntityY)
        this.globalEntityX = globalEntityX
        this.globalEntityY = globalEntityY
    }

    use() {   // kommt später 
        
    }
}