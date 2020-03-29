export class AbstractBot {
    constructor(bot) {
        this.bot = bot;
    }

    on(...args) {
        return this.bot.on(...args);
    }

    emit(...args) {
        return this.bot.emit(...args);
    }

    removeListener(...args) {
        return this.bot.removeListener(...args);
    }

    sendMessage(...args) {
        return this.bot.sendMessage(...args);
    }

    editMessageText(...args) {
        return this.bot.editMessageText(...args);
    }

    deleteMessage(...args) {
        return this.bot.deleteMessage(...args);
    }

    sendPhoto(...args) {
        return this.bot.sendPhoto(...args);
    }

    editMessageMedia(...args) {
        return this.bot.editMessageMedia(...args);
    }
}
