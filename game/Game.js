const {getRandomLoot, getRandomTreasure} = require('./generateItems');

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
            player.addTreasure(getRandomLoot());
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
    }

    nextTurn() {
        this.currentPlayersTurnIndex = this.currentPlayersTurnIndex + 1 >= this.players.length ? 0 : this.currentPlayersTurnIndex + 1;
        this.currentPhase = null;
        this.currentItems = [];
        this.currentLoot = null;
    }

    getRandomLoot() {
        return getRandomLoot();
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
                defenseUp: 0
            },
            monster: {
                attackUp: 0,
                defenseUp: 0
            }
        };

        return this.currentItems.reduce((modifiers, item) => {
            modifiers[item.affects].attackUp += item.attackUp;
            modifiers[item.affects].defenseUp += item.defenseUp;

            return modifiers;
        }, result);
    }
}

module.exports = Game;