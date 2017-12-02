const {botName, channel} = require('../config');

function isForBot(name) {
    return botName === name;
}

module.exports = {
    isForBot
};