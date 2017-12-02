const equippableItems = [
    {
        name: 'Helm of +1 defense',
        description: 'A shiny helmet that looks like it might save you...maybe',
        attackUp: 0,
        defenseUp: 1,
        type: 'head'
    },
    {
        name: 'Armor of +1 defense',
        description: 'Shiny armor that looks like it might stop attacks',
        attackUp: 0,
        defenseUp: 1,
        type: 'body'
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
]

function generateEquippableItems() {
    return equippableItems;
}

function generateLoots() {
    return loots;
}

module.exports = {
    generateEquippableItems,
    generateLoots
};