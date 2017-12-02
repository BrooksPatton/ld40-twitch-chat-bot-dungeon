class Game {
    constructor() {
        this.players = [];
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
}

module.exports = Game;