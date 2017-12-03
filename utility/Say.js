class Say {
    constructor(channel, client) {
        this.queue = [];
        this.timeBetweenMessages = 5000;
        this.channel = channel;
        this.client = client;
        this.run();
        this.currentMessage;
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

            case 'multi-whisper':
                this.sendMultiLineWhisperMessage(text, whisperTarget);
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
        this.currentMessage = this.queue.shift();
        return this.currentMessage;
    }

    sendWhisperMessage(text, username) {
        this.client.whisper(username, text)
            .then(data => console.log('sent whisper', data));
    }

    sendMultiLineWhisperMessage(messages, username) {
        if(messages.length === 0) return;

        const message = messages.shift();

        this.client.whisper(username, message)
            .catch(e => this.resendMessage());

        setTimeout(() => this.sendMultiLineWhisperMessage(messages, username), 2000);
    }

    resendMessage() {
        this.queue.push(this.currentMessage);
    }
}

module.exports = Say;