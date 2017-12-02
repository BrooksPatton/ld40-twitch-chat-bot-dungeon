require('dotenv').config()

const {client, say} = require('./connection/bot');
const {isForBot, tell} = require('./utility/miscl');
const Game = require('./game/Game');
const Player = require('./game/Player');
const Message = require('./utility/Message');

const game = new Game();

client.on('chat', (channel, userstate, message, self) => {
    if(self) return;

    const [bot, command] = message.toLowerCase().split(' ');

    if(isForBot(bot)) handleCommand(command, userstate.username);
});

function handleCommand(command, username) {
    switch (command) {
        case 'repo':
            say.addMessage(new Message('Find my code at https://github.com/BrooksPatton/ld40-twitch-chat-bot-dungeon'));
            break;
        
        case 'status':
            if(game.isActive) {
                say.addMessage(new Message('A game is being played right now'));
            }else {
                say.addMessage(new Message('No game is being played right now'));
            }
            break;

        case 'join':
            if(game.isInGame(username)) {
                say.addMessage(new Message(`${username}, you are already playing`));
            } else {
                const player = new Player(username);
                game.addPlayer(player);

                say.addMessage(new Message(`${username} you are now entering the dungeon`));
                say.addMessage(new Message(`You have no weapons, and can only do ${player.damage.sides}d${player.damage.dice} damage`, 'whisper', username));
            }
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