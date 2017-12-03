require('dotenv').config()

const {client, say} = require('./connection/bot');
const {isForBot, tell} = require('./utility/miscl');
const Game = require('./game/Game');
const Player = require('./game/Player');
const Message = require('./utility/Message');
const Item = require('./game/Item');
const {generateEquippableItems, generateLoots} = require('./game/generateItems');

const game = new Game(generateEquippableItems(), generateLoots(), say, Message);

client.on('chat', (channel, userstate, message, self) => {
    if(self) return;

    const [bot, command] = message.toLowerCase().split(' ');

    if(isForBot(bot)) handleCommand(command, userstate.username);
});

function handleCommand(command, username) {
    let player;

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
                player = new Player(username);

                game.addPlayer(player);

                say.addMessage(new Message(`${username} you are now entering the dungeon. I whispered you your current status`));
                say.addMessage(new Message(player.status, 'multi-whisper', username));
            }
            break;

        case 'status':
            player = game.getPlayer(username);

            if(!player) break;

            say.addMessage(new Message(player.status, 'multi-whisper', username));
            break;

        case 'explore':
            player = game.getCurrentPlayer();

            if(player.username !== username) {
                say.addMessage(new Message(`It is not your turn ${username}`));
            } else {
                if(game.currentPhase === 'waiting') {
                    game.stopTimer();
                    game.nextPhase();
                    game.currentLoot = game.getRandomLoot();
                    say.addMessage(new Message(`You explore the dungeon and see a ${game.currentLoot.name}.`));

                    if(game.currentLoot.type !== 'monster') {
                        player.addTreasure(game.currentLoot);
                        // say.addMessage(new Message(`Play a monster card or loot the room`));
                    } else {
                        game.nextPhase();
                    }
                }
            }
            break;

        case 'help':
            say.addMessage(new Message([
                'I am a game bot here to kill you in my dungeon',
                'Possible commands:',
                'repo - how you can find my code',
                'game - is there a game being played now',
                'join - join a game!',
                'status - be whispered your status',
                'explore - explore a room in the dungeon when it is your turn',
                'help - how do you think you got here?'
            ], 'multi-line'));

            break;
    
        default:
            say.addMessage("I couldn't understand you :(");
            break;
    }
}

setInterval(() => playGame(), 10000);

function playGame() {
    if(!game.isActive) return;

    const player = game.getCurrentPlayer();

    if(game.timedOut) {
        say.addMessage(new Message(`${player.username} waited too long`));
        game.timedOut = false;
        game.nextTurn();
    }

    if(!game.currentPhase) {
        say.addMessage(new Message(`${player.username} it is your turn, start by exploring`));
        game.nextPhase();
        game.waitingForPlayerResponse();
    }
}