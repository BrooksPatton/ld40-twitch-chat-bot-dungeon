const Monster = require('./Monster');

const treasure = [
    {
        name: 'Helm of +1 defense',
        description: 'A shiny helmet that looks like it might save you...maybe',
        attackUp: 0,
        defenseUp: 1,
        type: 'defense'
    },
    {
        name: 'Armor of +1 defense',
        description: 'Shiny armor that looks like it might stop attacks',
        attackUp: 0,
        defenseUp: 1,
        type: 'defense'
    },
    {
        name: 'Wooden stick',
        description: 'It looks like kindling from a fireplace',
        attackUp: 1,
        defenseUp: 0,
        type: 'weapon'
    },
    {
        name: 'broken spear',
        description: 'Some people say a broken spear is just a stick',
        attackUp: 1,
        defenseUp: 0,
        type: 'weapon'
    },
];

const loots = [
    {
        name: 'potion of +5 monster health',
        description: 'it looks oily',
        attackUp: 0,
        defenseUp: 5,
        type: 'item'
    },
    {
        name: 'potion of +5 monster attack',
        description: 'it looks fiery',
        attackUp: 5,
        defenseUp: 0,
        type: 'item'
    },
    {
        name: 'boomerang',
        description: 'You can hit a monster to reduce its health by 3',
        attackUp: 0,
        defenseUp: -3,
        type: 'item'
    },
    {
        name: 'radiation',
        description: 'it looks green',
        attackUp: 5,
        defenseUp: -5,
        type: 'item'
    },
];

const monsters = [
    {
        name: 'kobold',
        description: 'A creature that looks small, but might still cut you up with its dirty knife.',
        damage: {
            sides: 6,
            dice: 1
        },
        health: 3
    },
    {
        name: 'crash-test-dummy',
        description: 'It does not look dangerous, if you die to it everyone will laugh at you',
        damage: {
            sides: 1,
            dice: 1
        },
        health: 1
    },
    {
        name: 'dragon',
        description: 'Just run',
        damage: {
            sides: 4,
            dice: 6
        },
        health: 20
    },
    {
        name: 'rat',
        description: 'Are rats poisonous in this game?',
        damage: {
            sides: 3,
            dice: 1
        },
        health: 2
    },
]

function getRandomTreasure() {
    const r = Math.floor(Math.random() * treasure.length);

    return treasure[r];
}

function getRandomLoot() {
    if(Math.random() > 0.5) {
        const r = Math.floor(Math.random() * loots.length);

        return loots[r];
    } else {
        const r = Math.floor(Math.random() * monsters.length);
        const monster = monsters[r];
        const level = Math.ceil(Math.random() * 2);

        return new Monster(monster.name, monster.description, monster.damage, level, getRandomTreasure(), monster.health);
    }
}

module.exports = {
    getRandomTreasure,
    getRandomLoot
};