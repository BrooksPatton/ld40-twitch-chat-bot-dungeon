class Say {
    constructor(channel, client) {
        this.queue = [];
        this.timeBetweenMessages = 1000;
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
                this.processMessage();
                resolve();
            }, this.timeBetweenMessages);
        });
    }

    processMessage() {
        const message = this.getMessage();

        if(!message) return;

        const {text, type, whisperTarget} = message;

        switch (type) {
            case 'normal':
                this.sendNormalMessage(text);
                break;

            case 'multi-line':
                this.sendMultiLineMessage(text);
                break;

            case 'whisper':
                this.sendWhisperMessage(text, whisperTarget);
                break;
        
            default:
                break;
        }
    }

    sendNormalMessage(text) {
        this.client.say(this.channel, text);
    }

    sendMultiLineMessage(messages) {
        messages.forEach(message => this.client.say(this.channel, message));
    }

    getMessage() {
        return this.queue.shift();
    }

    sendWhisperMessage(text, username) {
        this.client.whisper(username, text);
    }
}

module.exports = Say;