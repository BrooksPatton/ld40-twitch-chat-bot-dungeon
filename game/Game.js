class Game {
    constructor(treasures, loots) {
        this.players = [];
        this.treasures = treasures;
        this.loots = loots;
        this.currentPlayersTurnIndex = 0;
        this.phases = [
            'waiting',
            'explore',
            'ask for help',
            'use items',
            'fight',
            'loot',
            'run away'
        ];
        this.currentPhase = null;
        this.waitTimer;
        this.currentLoot;
        this.timedOut = false;
    }

    nextPhase() {
        switch (this.currentPhase) {
            case null:
                this.currentPhase = 'waiting';
                break;

            case 'waiting':
                this.currentPhase = 'explore';
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
            player.addTreasure(this.getRandomTreasure());
        }
    }

    getRandomTreasure() {
        const r = Math.floor(Math.random() * this.treasures.length);

        return this.treasures[r];
    }

    giveRandomLootsToPlayer(player) {
        for(let i = 0; i < 2; i = i + 1) {
            player.addTreasure(this.getRandomLoot());
        }
    }

    getRandomLoot() {
        const r = Math.floor(Math.random() * this.loots.length);

        return this.loots[r];
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
    }
}

module.exports = Game;