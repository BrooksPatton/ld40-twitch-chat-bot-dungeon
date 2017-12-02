const tmi = require('tmi.js');
const Say = require('../utility/Say');
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
    say.addMessage('A large dungeon appears in chat, any of you dare to enter to gain its riches join a party now and test your luck.');
});

client.on('disconnected', (reason) => {
    console.log('disconnected from twitch', reason);
});

module.exports = {
    client,
    say
};