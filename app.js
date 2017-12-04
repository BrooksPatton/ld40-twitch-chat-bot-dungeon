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

    const [command, item, targetUsername] = message.toLowerCase().split(' ');

    handleCommand(command, userstate.username, item, targetUsername);
});

function handleCommand(command, username, item, targetUsername) {
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

                say.addMessage(new Message(`${username} you are now entering the dungeon. Here is your current status:`));
                say.addMessage(new Message(player.status));
            }
            break;

        case '!status':
            var player = game.getPlayer(username);

            if(!player) break;

            say.addMessage(new Message(player.status));
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
                    say.addMessage(new Message(`${player.username} You explore the dungeon and see a ${game.currentLoot.level ? 'level ' + game.currentLoot.level : ''} ${game.currentLoot.name}.`));

                    if(game.currentLoot.type !== 'monster') {
                        player.addTreasure(game.currentLoot);
                    }
                    game.nextPhase();
                }
            }
            break;

        case '!play': {
            var itemPlayed = false;

            if(game.currentPhase !== 'use items') return say.addMessage(new Message(`Cannot play items now`));

            if(!item) {
                return say.addMessage(new Message(`You must state what item or monster you want to play`));
            } else {
                var player = game.getPlayer(username);
                var loot = player.getLoot(item);

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
                        itemPlayed = true;
                    }
                } else {
                    game.playItem(loot);
                    say.addMessage(new Message(loot.description));
                    player.removeLoot(loot);
                    itemPlayed = true;
                }
            }

            if(itemPlayed) {
                game.stopTimer();
                const time = 1000 * secondsToWaitPerPlayer;
                const message = `${time / 1000} seconds left to play items. Use command !skip to move to next phase`;
                say.addMessage(new Message(message));
                return game.waitTimer = setTimeout(() => game.nextPhase(), time);
            }
            break;
        }

        case '!run':
            var player = game.getCurrentPlayer();
            var phase = game.currentPhase;

            if(phase === 'ask for help' || phase === 'use items') {
                if(player.username !== username) return say.addMessage(new Message(`Only ${player.username} can decide to run away`));

                player.toggleRunningAway();

                const message = player.runningAway ? 'You are now running away' : 'You are facing the monster bravely';

                say.addMessage(new Message(message));
            }
            break;

        case '!transfer':
            var player = game.getPlayer(username);
            const itemToTransfer = player.getLoot(item) || player.getTreasure(item);
            let message;
            const targetPlayer = game.getPlayer(targetUsername);

            if(!player) {
                message = `You are not in the game`;
            }
            else if(!itemToTransfer) {
                message = `itemToTransfer not found`;
            } else if(!targetPlayer) {
                message = `Target player not found`;
            } else {
                player.removeLoot(itemToTransfer) || player.removeTreasure(itemToTransfer);
                targetPlayer.addTreasure(itemToTransfer);
                message = `${itemToTransfer.name} has been transferred to ${targetPlayer.username}`;
            }

            say.addMessage(new Message(message));
            break;

        case '!skip':
            var player = game.getCurrentPlayer();
            var phase = game.currentPhase;

            if(player.username !== username) {
                const message = `Only ${player.username} can skip right now`;
                return say.addMessage(new Message(message));
            } else if(phase === 'waiting') {
                const message = `Skipping ${player.username}'s turn`;
                say.addMessage(new Message(message));
                game.stopTimer();
                game.timedOut = false;
                return game.nextTurn();
            } else if(phase === 'ask for help' || phase === 'use items') {
                game.stopTimer();
                game.timedOut = false;
                return game.nextPhase();
            }
            break;

        case '!item':
            if(!item) return say.addMessage(new Message(`Item not found`));

            var description = game.getItemDescription(item);

            if(description) return say.addMessage(new Message(description));

            return say.addMessage(new Message(`Item not found`));
            break;

        case '!help':
            say.addMessage(new Message([
                'Possible commands:',
                '!repo - link to where you can find the code that I am created with',
                '!item [item name] - Display the description of an item',
                '!game - is there a game being played now',
                '!join - join a game!',
                '!status - see your status',
                '!explore - explore a room in the dungeon when it is your turn',
                '!play [item name] - plays an item to affect combat',
                '!run - run away from the monster',
                '!transfer [item name] [player name] - Give an item to another player',
                '!skip - skip the current phase',
                '!help - this help'
            ], 'multi-line'));

            break;
    
        default:
            break;
    }
}

setInterval(() => playGame(), 0);

function playGame() {
    if(!game.isActive) return;

    const player = game.getCurrentPlayer();

    if(game.timedOut) {
        say.addMessage(new Message(`${player.username} waited too long`));
        game.timedOut = false;
        return game.nextTurn();
    }

    if(!game.currentPhase) {
        say.addMessage(new Message(`${player.username} it is your turn, start by exploring`));
        game.nextPhase();
        return game.waitingForPlayerResponse();
    } else if(game.currentPhase === 'ask for help') {
        if(game.messageSentThisPhase) return;

        let message;
        const time = 1000 * secondsToWaitPerPlayer * (game.numberOfplayers - 1);
        const seconds = time / 1000;

        if(game.currentLoot.type === 'monster') {
            message = `${player.username} you have ${seconds} seconds to negotiate help fighting the ${game.currentLoot.name} if you need it.`;
        } else {
            message = `${player.username} you have ${seconds} seconds to negotiate help in case you want to fight your own monster`;
        }

        say.addMessage(new Message(message));
        game.waitTimer = setTimeout(() => game.nextPhase(), time);
        return game.messageSentThisPhase = true;
    } else if(game.currentPhase === 'use items') {
        if(game.messageSentThisPhase) return;

        const time = 1000 * secondsToWaitPerPlayer * game.numberOfplayers;
        const seconds = time / 1000;

        say.addMessage(new Message(`All players, you now have ${seconds} seconds to use an item. Time will be reset for each item used`));

        game.waitTimer = setTimeout(() => game.nextPhase(), time);
        return game.messageSentThisPhase = true;
    } else if(game.currentPhase === 'fight') {
        game.stopTimer();

        if(game.currentLoot.type === 'monster') {
            const monster = game.currentLoot;
            const modifiers = game.calculateCombatModifiers();
            let message = `Entering combat phase - commands cannot be used`;

            say.addMessage(new Message(message));
            message = ``;
            
            if(modifiers.player.attackUp !== 0) message = `${message} player attack up ${modifiers.player.attackUp}`;
            if(modifiers.player.defenseUp !== 0) message = `${message} player defense up ${modifiers.player.defenseUp}`;
            if(modifiers.player.escapeUp !== 0) message = `${message} player escape up ${modifiers.player.escapeUp}`;
            if(modifiers.monster.attackUp !== 0) message = `${message} monster attack up ${modifiers.monster.attackUp}`;
            if(modifiers.monster.defenseUp !== 0) message = `${message} monster defense up ${modifiers.monster.defenseUp}`;

            say.addMessage(new Message(message));

            while(player.health > 0) {
                if(!player.runningAway) {
                    let damage = player.getDamage() + modifiers.player.attackUp;
                    let message;

                    message = `${player.username}(${player.health}) hits ${monster.name}(${monster.health}) for ${damage} damage`;
                    say.addMessage(new Message(message));
                    monster.hitBy(damage, modifiers);
                } else {
                    if(player.didRunAway(modifiers)) {
                        say.addMessage(new Message(`${player.username} ran away!`));
                        break;
                    } else {
                        say.addMessage(new Message(`The monster blocked ${player.username} from running away`));
                    }
                }
                
                if(monster.health > 0) {
                    damage = monster.getDamage() + modifiers.monster.attackUp;

                    message = `${monster.name}(${monster.health}) hits ${player.username}(${player.health}) for ${damage} damage`;
                    say.addMessage(new Message(message));
                    player.hitBy(damage, modifiers);
                } else {
                    break;
                }
            }

            if(player.health <= 0) {
                say.addMessage(new Message(`${player.username} you fought valiantly but died to the ${monster.name}`));
                game.kill(player);
                return game.nextTurn();
            } else {
                if(player.runningAway) {
                    player.resetRunningAway();
                    return game.nextTurn();
                } else {
                    player.increaseLevel();
                    player.addTreasure(monster.treasure);
                    say.addMessage(new Message(`${player.username} you defeated the ${monster.name}! You get a ${monster.treasure.name} and increased to level ${player.level}`));
                    return game.nextPhase();
                }
            }

        } else {
            const loot = game.getRandomLoot();
            say.addMessage(new Message(`You loot through the room and find a ${loot.level ? 'level ' + loot.level : ''} ${loot.name}`));
            player.addTreasure(loot);
            return game.nextTurn();
        }
    } else if(game.currentPhase === 'resolve turn') {
        if(player.level >= winLevel) {
            say.addMessage(new Message(`Game Over, ${player.username} won!`));
            return game = new Game();
        } else {
            player.resetHealth();
            return game.nextTurn();
        }
    }
}