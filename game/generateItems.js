const Monster = require('./Monster');

const treasure = [
    {
        name: 'shiny-helm',
        description: 'A shiny helmet that looks like it might save you...maybe',
        attackUp: 0,
        defenseUp: 1,
        type: 'defense'
    },
    {
        name: 'shiny-armor',
        description: 'Shiny armor that looks like it might stop attacks',
        attackUp: 0,
        defenseUp: 2,
        type: 'defense'
    },
    {
        name: 'stick',
        description: 'It looks like kindling from a fireplace',
        attackUp: 1,
        defenseUp: 0,
        type: 'weapon'
    },
    {
        name: 'broken-spear',
        description: 'Some people say a broken spear is just a stick',
        attackUp: 2,
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
        escapeUp: 0.1,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'sharp-claws',
        description: 'the monsters claws can cut tomatoes now. Attack up by 5',
        attackUp: 5,
        defenseUp: 0,
        escapeUp: 0.1,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'boomerang',
        description: 'A boomerang flies through the air and hits the monster in the head. Defense down by 5',
        attackUp: 0,
        defenseUp: -5,
        escapeUp: 0.1,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'nail-file',
        description: 'While the monster is not looking, its claws are filed down. Attack down by 5',
        attackUp: -5,
        defenseUp: 0,
        escapeUp: 0.1,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'radiation',
        description: 'The monster begins to glow green. It seems weaker but also stronger if that makes any sense. Attack up by 5 and defense down by 5',
        attackUp: 5,
        defenseUp: -5,
        escapeUp: 0.1,
        type: 'item',
        affects: 'monster'
    },
    {
        name: 'protect',
        description: 'A glimmering force field surrounds the hero. Defense up by 5',
        attackUp: 0,
        defenseUp: 5,
        escapeUp: 0.1,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'sharpening-stone',
        description: 'The heros weapon looks sharper. Attack up by 5',
        attackUp: 5,
        defenseUp: 0,
        escapeUp: 0.1,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'slingshot',
        description: 'A rock flies through the air and hits the player in the head. Defense down by 5',
        attackUp: 0,
        defenseUp: -5,
        escapeUp: 0.1,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'broken-sword',
        description: 'It turns out the heros sword is broken. Attack down by 5',
        attackUp: -5,
        defenseUp: 0,
        escapeUp: 0.1,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'berzerk',
        description: 'The hero grows angry. They seems weaker but also stronger if that makes any sense. Attack up by 5 and defense down by 5',
        attackUp: 5,
        defenseUp: -5,
        escapeUp: 0.1,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'sneakers',
        description: 'The hero feels like they can run a marathon, escape up by 5%',
        attackUp: 0,
        defenseUp: -0,
        escapeUp: 0.05,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'blink',
        description: 'The hero binks several feet away, escape up by 5%',
        attackUp: 0,
        defenseUp: -0,
        escapeUp: 0.05,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'tacks',
        description: 'Tacks cover the floor, escape down by 5%',
        attackUp: 0,
        defenseUp: -0,
        escapeUp: -0.05,
        type: 'item',
        affects: 'player'
    },
    {
        name: 'confuse',
        description: 'The hero forgets where the entrance is, escape down by 5%',
        attackUp: 0,
        defenseUp: -0,
        escapeUp: -0.05,
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
        health: 2
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
    {
        name: 'goblin',
        description: 'A goblin, and it does not like you',
        damage: {
            sides: 4,
            dice: 2
        },
        health: 7
    },
    {
        name: 'mummy',
        description: 'It wants to curse you',
        damage: {
            sides: 3,
            dice: 3
        },
        health: 10
    },
    {
        name: 'twitch-streamer',
        description: 'They can 360 no scope you because they practice 20 hours a day',
        damage: {
            sides: 6,
            dice: 4
        },
        health: 8
    },
    {
        name: 'munchkin',
        description: 'the most dangerous of them all',
        damage: {
            sides: 3,
            dice: 2
        },
        health: 4
    },
]

function getRandomTreasure() {
    const r = Math.floor(Math.random() * treasure.length);

    return treasure[r];
}

function getRandomLoot(levelCap) {
    if(Math.random() > 0.5) {
        const r = Math.floor(Math.random() * loots.length);

        return loots[r];
    } else {
        const r = Math.floor(Math.random() * monsters.length);
        const monster = monsters[r];
        const level = Math.ceil(Math.random() * levelCap);

        return new Monster(monster.name, monster.description, monster.damage, level, getRandomTreasure(), monster.health);
    }
}

module.exports = {
    getRandomTreasure,
    getRandomLoot,
    treasure,
    loots,
    monsters
};