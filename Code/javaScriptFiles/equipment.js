export class Equipment {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
    }

    // Diese Methode wird von JEDEM Equipment überschrieben
    // Sie wird jeden Frame aufgerufen
    update(player, map, inputState) {
        // Basis-Klasse macht nichts
    }
}