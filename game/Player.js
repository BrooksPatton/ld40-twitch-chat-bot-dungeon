class Player {
    constructor(username) {
        this.username = username;
        this.damage = {
            sides: 1,
            dice: 1
        };
        this.level = 1;
        this.equipped = {
            head: {},
            body: {},
            weapons: []
        };
        this.items = [];
        this.monsters = [];
    }

    get status() {
        const output = [
            `level: ${this.level}`,
            `-- Current equipment --`,
            `head: ${this.equipped.head.name}`,
            `body: ${this.equipped.body.name}`
        ];

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
            case 'head':
                this.equipped.head = treasure;
                break;

            case 'body':
                this.equipped.body = treasure;
                break;

            case 'weapon':
                this.equipped.weapons.push(treasure);
                break;

            case 'item':
                this.items.push(treasure);
                break;
        
            default:
                break;
        }
    }
}

module.exports = Player;