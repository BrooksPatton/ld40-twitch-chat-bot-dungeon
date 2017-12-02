const game = {
    active: true
};

function isActiveGame() {
    return new Promise((resolve, reject) => {
        return resolve(game.active === true);
    });
}

module.exports = {
    isActiveGame
};