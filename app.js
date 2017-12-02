require('dotenv').config()

const tmi = require('tmi.js');

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

client.connect();

client.on('connected', (address, port) => {
    console.log('connected to twitch', address, port);
    client.say('#brookzerker', 'A large dungeon appears in chat, any of you dare to enter to gain its riches join a party now and test your luck.');
});

client.on('disconnected', (reason) => {
    console.log('disconnected from twitch', reason);
});

client.on('chat', (channel, userstate, message, self) => {
    // console.log('chat received', message);
});

client.on('emotesets', (sets, obj) => {
    // console.log('emote sets', obj);
});