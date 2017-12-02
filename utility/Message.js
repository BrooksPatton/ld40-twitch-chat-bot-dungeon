class Message {
    constructor(text, type = 'normal', whisperTarget) {
        this.text = text;
        this.type = type;
        this.whisperTarget = whisperTarget;
    }
}

module.exports = Message;