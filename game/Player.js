class Player {
    constructor(username) {
        this.username = username;
        this.damage = {
            sides: 1,
            dice: 1
        };
        this.level = 1;
        this.equipped = {
            head: null,
            body: null,
            weapon1: null,
            weapon2: null
        };
        this.items = [];
        this.monsters = [];
    }

    get status() {
        const output = [
            `level: ${this.level}`,
            `-- Current equipment --`,
            `head: ${this.equipped.head}`,
            `body: ${this.equipped.body}`,
            `weapon1: ${this.equipped.weapon1}`,
            `weapon2: ${this.equipped.weapon2}`,
            `-- Current items --`
        ];

        this.items.forEach(item => output.push(item.name));

        output.push(`-- Monsters --`);

        this.monsters.forEach(monster => output.push(monster.name));

        return output;
    }
}

module.exports = Player;