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
        
        case 'status':
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

        case 'help':
            say.addMessage([
                'I am a game bot here to kill you in my dungeon',
                'Possible commands:',
                'repo - how you can find my code',
                'status - is there a game being played now',
                'help - how do you think you got here?'
            ]);

            break;
    
        default:
            say.addMessage("I couldn't understand you :(");
            break;
    }
}