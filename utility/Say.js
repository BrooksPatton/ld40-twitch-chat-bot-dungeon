class Say {
    constructor(channel, client) {
        this.queue = [];
        this.timeBetweenMessages = 300;
        this.channel = channel;
        this.client = client;
        this.run();
    }

    addMessage(message) {
        if(typeof message === 'string') {
            this.queue.push(message);
        } else {
            message.forEach(str => this.queue.push(str));
        }
    }

    run() {
        this.timeout()
            .then(() => this.run());
    }

    timeout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.sendMessage();
                resolve();
            }, this.timeBetweenMessages);
        });
    }

    sendMessage() {
        const message = this.getMessage();

        if(message) this.client.say(this.channel, message);
    }

    getMessage() {
        return this.queue.shift();
    }
}

module.exports = Say;