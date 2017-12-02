class Game {
    constructor(treasures, loots) {
        this.players = [];
        this.treasures = treasures;
        this.loots = loots;
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

        return this.treasures.splice(r, 1)[0];
    }

    giveRandomLootsToPlayer(player) {
        for(let i = 0; i < 2; i = i + 1) {
            player.addTreasure(this.getRandomLoot());
        }
    }

    getRandomLoot() {
        const r = Math.floor(Math.random() * this.loots.length);

        return this.loots.splice(r, 1)[0];
    }
}

module.exports = Game;