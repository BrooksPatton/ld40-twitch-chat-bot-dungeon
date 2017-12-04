const {
    getRandomLoot, 
    getRandomTreasure,
    treasure,
    loots,
    monsters
} = require('./generateItems');

class Game {
    constructor() {
        this.players = [];
        this.currentPlayersTurnIndex = 0;
        this.phases = [
            'waiting',
            'explore',
            'ask for help',
            'use items',
            'fight',
            'resolve turn'
        ];
        this.currentPhase = null;
        this.waitTimer;
        this.currentLoot;
        this.timedOut = false;
        this.messageSentThisPhase = false;
        this.currentItems = [];
    }

    nextPhase() {
        this.messageSentThisPhase = false;

        switch (this.currentPhase) {
            case null:
                this.currentPhase = 'waiting';
                break;

            case 'waiting':
                this.currentPhase = 'explore';
                break;

            case 'explore':
                this.currentPhase = 'ask for help';
                break;

            case 'ask for help':
                this.currentPhase = 'use items';
                break;

            case 'use items':
                this.currentPhase = 'fight';
                break;

            case 'fight':
                this.currentPhase = 'resolve turn';
                break;
        
            default:
                break;
        }
    }

    get isActive() {
        return this.players.length > 0;
    }

    isInGame(username) {
        let inGame = false;

        for(let i = 0; i < this.players.length; i = i + 1) {
            const player = this.players[i];

            if(player.username === username) {
                inGame = true;
                break;
            }
        }

        return inGame;
    }

    addPlayer(player) {
        this.giveRandomTreasuresToPlayer(player);
        this.giveRandomLootsToPlayer(player);
        this.players.push(player);
    }

    get getAllPlayers() {
        return this.players;
    }

    getPlayer(username) {
        for(let i = 0; i < this.players.length; i = i + 1) {
            const current = this.players[i];

            if(current.username === username) return current;
        }

        return false;
    }

    giveRandomTreasuresToPlayer(player) {
        for(let i = 0; i < 2; i = i + 1) {
            player.addTreasure(getRandomTreasure());
        }
    }

    giveRandomLootsToPlayer(player) {
        for(let i = 0; i < 2; i = i + 1) {
            player.addTreasure(this.getRandomLoot());
        }
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayersTurnIndex];
    }

    waitingForPlayerResponse() {
        this.waitTimer = setTimeout(() => {
            this.timedOut = true;
        }, 1000 * 60);
    }

    stopTimer() {
        clearTimeout(this.waitTimer);
        this.waitTimer = null;
    }

    nextTurn() {
        if(this.waitTimer) this.stopTimer();
        this.currentPlayersTurnIndex = this.currentPlayersTurnIndex + 1 >= this.players.length ? 0 : this.currentPlayersTurnIndex + 1;
        this.currentPhase = null;
        this.currentItems = [];
        this.currentLoot = null;
    }

    getRandomLoot() {
        const numberOfplayers = this.players.length;
        const highestPlayerLevel = this.players.reduce((highestLevel, player) => player.level > highestLevel ? player.level : highestLevel, 0);

        return getRandomLoot(numberOfplayers + highestPlayerLevel);
    }

    kill(player) {
        const i = this.players.indexOf(player);

        if(i >= 0) {
            this.players.splice(i, 1);
            this.currentPlayersTurnIndex = this.currentPlayersTurnIndex - 1;
        }
    }

    get numberOfplayers() {
        return this.players.length;
    }

    playItem(loot) {
        this.currentItems.push(loot);
    }

    calculateCombatModifiers() {
        const result = {
            player: {
                attackUp: 0,
                defenseUp: 0,
                escapeUp: 0
            },
            monster: {
                attackUp: 0,
                defenseUp: 0,
                escapeUp: 0
            }
        };

        return this.currentItems.reduce((modifiers, item) => {
            modifiers[item.affects].attackUp += item.attackUp;
            modifiers[item.affects].defenseUp += item.defenseUp;
            modifiers[item.affects].escapeUp += item.escapeUp;

            return modifiers;
        }, result);
    }

    getItemDescription(name) {
        let foundItem = treasure.find(t => t.name === name) || loots.find(l => l.name === name) || monsters.find(m => m.name === name);
        let description;

        if(!foundItem) return null;

        if(foundItem.type === 'defense') {
            description = `${foundItem.name} - defenseUp: ${foundItem.defenseUp} - ${foundItem.description}`;
        } else if(foundItem.type === 'weapon') {
            description = `${foundItem.name} - attackUp: ${foundItem.attackUp} - ${foundItem.description}`;
        } else if(foundItem.type === 'item') {
            description = `${foundItem.name} - affects: ${foundItem.affects} - ${foundItem.attackUp !== 0 ? 'attackUp: ' + foundItem.attackUp : ''} - ${foundItem.defenseUp !== 0 ? 'defenseUp: ' + foundItem.defenseUp : ''} - ${foundItem.escapeUp !== 0 ? 'escapeUp: ' + foundItem.escapeUp : ''} - ${foundItem.description}`;
        } else {
            description = `${foundItem.name} - damage: ${foundItem.damage.dice}d${foundItem.damage.sides} - health: ${foundItem.health} - ${foundItem.description}`;
        }

        return description;
    }
}

module.exports = Game;