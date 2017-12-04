const tmi = require('tmi.js');
const Say = require('../utility/Say');
const Message = require('../utility/Message');
const {channel} = require('../config');

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: 'brookzerker',
        password: process.env.PASSWORD
    },
    channels: ['#brookzerker']
};

const client = new tmi.client(options);
const say = new Say(channel, client);

client.connect();

client.on('connected', (address, port) => {
    console.log('connected to twitch', address, port);
    say.addMessage(new Message('Gamebot is online, send !help to see the help, or !join to join a game.'));
});

client.on('disconnected', (reason) => {
    console.log('disconnected from twitch', reason);
});

client.on('notice', (channel, msgid, message) => {
    console.log('****** NOTICE FROM TWITCH *****');
    console.log(msgid, message);
})

module.exports = {
    client,
    say
};