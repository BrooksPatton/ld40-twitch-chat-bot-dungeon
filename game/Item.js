class Item {
    constructor(name, description, attackUp=0, defenseUp=0, type) {
        this.name = name;
        this.description = description;
        this.attackUp = attackUp;
        this.defenseUp = defenseUp;
        this.type = type;
    }
}

module.exports = Item;