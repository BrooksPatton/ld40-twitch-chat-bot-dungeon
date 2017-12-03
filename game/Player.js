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
        this.runningAway = false;
        this.runawayChance = 0.33;
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
        this.monsters.forEach(monster => output.push(`level ${monster.level} ${monster.name}`));

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

    hitBy(damage, modifiers) {
        const defense = this.calculateDefense() + modifiers.player.defenseUp;

        damage = defense >= damage ? 0 : damage - defense;

        this.health = this.health - damage;
    }

    calculateDefense() {
        return this.equipped.defense.reduce((total, item) => total + item.defenseUp, 0);
    }

    increaseLevel() {
        this.level = this.level + 1;
    }

    getLoot(item) {
        let loot = this.items.find(thing => thing.name === item);

        if(!loot) loot = this.monsters.find(thing => thing.name === item);

        return loot;
    }

    removeLoot(loot) {
        let index = this.items.findIndex(item => item.name === loot.name);

        if(index > -1) return this.items.splice(index, 1);

        index = this.monsters.findIndex(monster => monster.name === loot.name);

        if(index > -1) return this.monsters.splice(index, 1);
    }

    resetRunningAway() {
        this.runningAway = false;
    }

    toggleRunningAway() {
        this.runningAway = !this.runningAway;
    }

    didRunAway(modifiers) {
        const r = Math.random();

        return r < this.runawayChance + modifiers.player.escapeUp;
    }

    resetHealth() {
        this.health = this.baseHealth;
    }
}

module.exports = Player;