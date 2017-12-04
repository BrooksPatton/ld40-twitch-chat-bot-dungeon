class Monster {
    constructor(name, description, damage, level, treasure, health) {
        this.name = name;
        this.description = description;
        this.damage = {
            sides: damage.sides,
            dice: damage.dice * level
        };
        this.level = level;
        this.treasure = treasure;
        this.health = Math.ceil(health * (level / 1.5));
        this.type = 'monster';
    }

    hitBy(damage, modifiers) {
        const defense = modifiers.monster.defenseUp;

        damage = defense >= damage ? 0 : damage - defense;
        this.health = this.health - damage;
    }

    getDamage() {
        let damage = 0;

        for(let i = 0; i < this.damage.dice; i = i + 1) {
            const r = Math.ceil(Math.random() * this.damage.sides);

            damage = damage + r;
        }

        return damage;
    }
}

module.exports = Monster;