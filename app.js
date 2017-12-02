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
        
        case 'game':
            if(game.isActive) {
                const messages = [
                    'A game is being played right now',
                    'Here is who is in the dungeon'
                ];

                game.getAllPlayers.forEach(player => messages.push(`${player.username} is level ${player.level}`));
                say.addMessage(new Message(messages, 'multi-line'));
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

                say.addMessage(new Message(`${username} you are now entering the dungeon. I whispered you your current status`));
                say.addMessage(new Message(player.status, 'multi-whisper', username));
            }
            break;

        case 'status':
            const player = game.getPlayer(username);

            if(!player) break;

            say.addMessage(new Message(player.status, 'multi-whisper', username));
            break;

        case 'help':
            say.addMessage(new Message([
                'I am a game bot here to kill you in my dungeon',
                'Possible commands:',
                'repo - how you can find my code',
                'game - is there a game being played now',
                'join - join a game!',
                'status - be whispered your status',
                'help - how do you think you got here?'
            ], 'multi-line'));

            break;
    
        default:
            say.addMessage("I couldn't understand you :(");
            break;
    }
}