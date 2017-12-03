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
        name: 'hard-scales',
        description: 'the monsters skin hardens. Defense up by 5',
        attackUp: 0,
        defenseUp: 5,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'sharp-claws',
        description: 'the monsters claws can cut tomatoes now. Attack up by 5',
        attackUp: 5,
        defenseUp: 0,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'boomerang',
        description: 'A boomerang flies through the air and hits the monster in the head. Defense down by 5',
        attackUp: 0,
        defenseUp: -5,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'nail-file',
        description: 'While the monster is not looking, its claws are filed down. Attack down by 5',
        attackUp: -5,
        defenseUp: 0,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'radiation',
        description: 'The monster begins to glow green. It seems weaker but also stronger if that makes any sense. Attack up by 5 and defense down by 5',
        attackUp: 5,
        defenseUp: -5,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'protect',
        description: 'A glimmering force field surrounds the hero. Defense up by 5',
        attackUp: 0,
        defenseUp: 5,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'sharpening-stone',
        description: 'The heros weapon looks sharper. Attack up by 5',
        attackUp: 5,
        defenseUp: 0,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'slingshot',
        description: 'A rock flies through the air and hits the player in the head. Defense down by 5',
        attackUp: 0,
        defenseUp: -5,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'broken-sword',
        description: 'It turns out the heros sword is broken. Attack down by 5',
        attackUp: -5,
        defenseUp: 0,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'berzerk',
        description: 'The hero grows angry. They seems weaker but also stronger if that makes any sense. Attack up by 5 and defense down by 5',
        attackUp: 5,
        defenseUp: -5,
        type: 'item',
        affects: 'player'
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