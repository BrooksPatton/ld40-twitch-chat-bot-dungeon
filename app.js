require('dotenv').config()

const {client, say} = require('./connection/bot');
const {isForBot, tell} = require('./utility/miscl');
const {isActiveGame} = require('./db/queries');

client.on('chat', (channel, userstate, message, self) => {
    if(self) return;

    const [bot, command] = message.toLowerCase().split(' ');

    if(isForBot(bot)) handleCommand(command);
});

function handleCommand(command) {
    switch (command) {
        case 'repo':
            say.addMessage('Find my code at https://github.com/BrooksPatton/ld40-twitch-chat-bot-dungeon');
            break;
        
        case 'gamestatus':
            isActiveGame()
                .then(isActive => {
                    if(isActive) {
                        say.addMessage('A game is being played right now');
                    }
                    else {
                        say.addMessage('No game is being played right now');
                    }
                })
            break;
    
        default:
            say.addMessage("I couldn't understand you :(");
            break;
    }
}