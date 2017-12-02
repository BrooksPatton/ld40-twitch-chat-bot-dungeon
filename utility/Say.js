class Say {
    constructor(channel, client) {
        this.queue = [];
        this.timeBetweenMessages = 1000 * 1;
        this.channel = channel;
        this.client = client;
        this.run();
    }

    addMessage(message) {
        this.queue.push(message);
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