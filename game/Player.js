class Player {
    constructor(username) {
        this.username = username;
        this.damage = {
            sides: 1,
            dice: 1
        };
        this.level = 1;
        this.equipped = {
            defense: [],
            weapons: []
        };
        this.items = [];
        this.monsters = [];
        this.health = 10;
        this.baseHealth = 10;
    }

    get status() {
        const output = [
            `level: ${this.level}`,
            `-- Defense --`
        ];

        this.equipped.defense.forEach(item => output.push(item.name));

        output.push(`-- Weapons --`);
        this.equipped.weapons.forEach(weapon => output.push(weapon.name));

        output.push(`-- Current items --`);
        this.items.forEach(item => output.push(item.name));

        output.push(`-- Monsters --`);
        this.monsters.forEach(monster => output.push(monster.name));

        return output;
    }

    addTreasure(treasure) {
        switch (treasure.type) {
            case 'defense':
                this.equipped.defense.push(treasure);
                break;

            case 'weapon':
                this.equipped.weapons.push(treasure);
                this.damage.sides = this.damage.sides + treasure.attackUp;
                break;

            case 'item':
                this.items.push(treasure);
                break;

            case 'monster':
                this.monsters.push(treasure);
                break;
        
            default:
                break;
        }
    }

    getDamage() {
        let damage = 0;

        for(let i = 0; i < this.damage.dice * this.level; i = i + 1) {
            const r = Math.ceil(Math.random() * this.damage.sides);

            damage = damage + r;
        }

        return damage;
    }

    hitBy(damage) {
        const defense = this.calculateDefense();

        damage = defense >= damage ? 0 : damage - defense;

        this.health = this.health - damage;
    }

    calculateDefense() {
        return this.equipped.defense.reduce((total, item) => total + item.defenseUp, 0);
    }

    increaseLevel() {
        this.level = this.level + 1;
    }
}

module.exports = Player;