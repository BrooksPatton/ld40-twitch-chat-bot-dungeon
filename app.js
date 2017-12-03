require('dotenv').config()

const {client, say} = require('./connection/bot');
const Game = require('./game/Game');
const Player = require('./game/Player');
const Message = require('./utility/Message');
const Item = require('./game/Item');
const {secondsToWaitPerPlayer, winLevel} = require('./config');

let game = new Game();

client.on('chat', (channel, userstate, message, self) => {
    if(self) return;

    const [command, item] = message.toLowerCase().split(' ');

    handleCommand(command, userstate.username, item);
});

function handleCommand(command, username, item) {
    switch (command) {
        case '!repo':
            say.addMessage(new Message('Find my code at https://github.com/BrooksPatton/ld40-twitch-chat-bot-dungeon'));
            break;
        
        case '!game':
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

        case '!join':
            if(game.isInGame(username)) {
                say.addMessage(new Message(`${username}, you are already playing`));
            } else {
                var player = new Player(username);

                game.addPlayer(player);

                say.addMessage(new Message(`${username} you are now entering the dungeon. I whispered you your current status`));
                // say.addMessage(new Message(player.status, 'multi-whisper', username));
            }
            break;

        case '!status':
            var player = game.getPlayer(username);

            if(!player) break;

            say.addMessage(new Message(player.status, 'multi-whisper', username));
            break;

        case '!explore':
            var player = game.getCurrentPlayer();

            if(player.username !== username) {
                say.addMessage(new Message(`It is not your turn ${username}`));
            } else {
                if(game.currentPhase === 'waiting') {
                    game.stopTimer();
                    game.nextPhase();
                    game.currentLoot = game.getRandomLoot();
                    say.addMessage(new Message(`You explore the dungeon and see a level ${game.currentLoot.level} ${game.currentLoot.name}.`));

                    if(game.currentLoot.type !== 'monster') {
                        player.addTreasure(game.currentLoot);
                    }
                    game.nextPhase();
                }
            }
            break;

        case '!play': {
            if(game.currentPhase !== 'use items') return say.addMessage(new Message(`Cannot play items now`));

            if(!item) {
                return say.addMessage(new Message(`You must state what item or monster you want to play`));
            } else {
                var player = game.getPlayer(username);
                const loot = player.getLoot(item);

                if(!loot) return say.addMessage(new Message(`Loot item not found`));

                if(loot.type === 'monster') {
                    if(game.currentLoot.type === 'monster') return say.addMessage(new Message(`There is already a monster to fight`));

                    const currentPlayer = game.getCurrentPlayer();

                    if(currentPlayer.username !== player.username) {
                        return say.addMessage(new Message(`Only ${currentPlayer.username} can play a monster now`));
                    } {
                        game.currentLoot = loot;
                        say.addMessage(new Message(`You will now be facing a ${game.currentLoot.name}`))
                        player.removeLoot(loot);
                    }
                } else {
                    game.playItem(loot);
                    say.addMessage(new Message(loot.description));
                    player.removeLoot(loot);
                }
            }
            break;
        }

        case '!run':
            var player = game.getCurrentPlayer();
            const phase = game.currentPhase;

            if(phase === 'ask for help' || phase === 'use items') {
                if(player.username !== username) return say.addMessage(new Message(`Only ${player.username} can decide to run away`));

                player.toggleRunningAway();

                const message = player.runningAway ? 'You are now running away' : 'You are facing the monster bravely';

                say.addMessage(new Message(message));
            }
            break;

        case '!help':
            say.addMessage(new Message([
                'I am a game bot here to kill you in my dungeon',
                'Possible commands:',
                '!repo - how you can find my code',
                '!game - is there a game being played now',
                '!join - join a game!',
                '!status - be whispered your status',
                '!explore - explore a room in the dungeon when it is your turn',
                '!play [item name] - plays an item to affect combat',
                '!run - run away from the monster',
                '!help - this help'
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
    } else if(game.currentPhase === 'ask for help') {
        if(game.messageSentThisPhase) return;

        let message;
        const time = 1000 * secondsToWaitPerPlayer * (game.numberOfplayers - 1);
        const seconds = time / 1000;

        if(game.currentLoot.type === 'monster') {
            message = `${player.username} you have ${seconds > 0 ? seconds : ''} seconds to negotiate help fighting the ${game.currentLoot.name} if you need it.`;
        } else {
            message = `${player.username} you have ${seconds > 0 ? seconds : ''} seconds to negotiate help in case you want to fight your own monster`;
        }

        say.addMessage(new Message(message));
        setTimeout(() => game.nextPhase(), time);
        game.messageSentThisPhase = true;
    } else if(game.currentPhase === 'use items') {
        if(game.messageSentThisPhase) return;

        const time = 1000 * secondsToWaitPerPlayer * game.numberOfplayers;
        const seconds = time / 1000;

        say.addMessage(new Message(`All players, you now have ${seconds > 0 ? seconds : ''} seconds to use any items you want`));

        setTimeout(() => game.nextPhase(), time);
        game.messageSentThisPhase = true;
    } else if(game.currentPhase === 'fight') {
        if(game.currentLoot.type === 'monster') {
            const monster = game.currentLoot;
            const modifiers = game.calculateCombatModifiers();



            while(player.health > 0) {
                if(!player.runningAway) {
                    let damage = player.getDamage() + modifiers.player.attackUp;

                    monster.hitBy(damage, modifiers);
                    say.addMessage(new Message(`${player.username} hits ${monster.name} for ${damage} damage. It's health now is ${monster.health}`));
                } else {
                    if(player.didRunAway()) {
                        say.addMessage(new Message(`${player.username} ran away!`));
                        break;
                    } else {
                        say.addMessage(new Message(`The monster blocked ${player.username} from running away`));
                    }
                }
                
                if(monster.health > 0) {
                    damage = monster.getDamage() + modifiers.monster.attackUp;

                    player.hitBy(damage, modifiers);
                    say.addMessage(new Message(`${monster.name} hits ${player.username} for ${damage} damage. Their health now is ${player.health}`));
                } else {
                    break;
                }
            }

            if(player.health <= 0) {
                say.addMessage(new Message(`${player.username} you fought valiently but died to the ${monster.name}`));
                game.kill(player);
                game.nextTurn();
            } else {
                if(player.runningAway) {
                    player.resetRunningAway();
                    game.nextTurn();
                } else {
                    player.increaseLevel();
                    player.addTreasure(monster.treasure);
                    say.addMessage(new Message(`${player.username} you defeated the ${monster.name}! You get a treasure!!!`));
                    game.nextPhase();
                }
            }

        } else {
            say.addMessage(new Message(`You loot through the room and find something.`));
            player.addTreasure(game.getRandomLoot());
            game.nextTurn();
        }
    } else if(game.currentPhase === 'resolve turn') {
        if(player.level >= winLevel) {
            say.addMessage(new Message(`Game Over, ${player.username} won!`));
            game = new Game();
        } else {
            player.resetHealth();
            game.nextTurn();
        }
    }
}