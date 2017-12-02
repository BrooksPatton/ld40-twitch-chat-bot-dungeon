class Player {
    constructor(username) {
        this.username = username;
        this.damage = {
            sides: 1,
            dice: 1
        }
    }
}

module.exports = Player;