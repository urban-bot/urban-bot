import NodeTelegramBot from 'node-telegram-bot-api';

export class TelegramBot {
    constructor(token, options) {
        this.bot = new NodeTelegramBot(token, options);
    }

    on(event, listener) {
        return this.bot.on(event, listener);
    }

    emit(type, message, metadata) {
        return this.bot.emit(type, message, metadata);
    }

    removeListener(eventName, listener) {
        return this.bot.removeListener(eventName, listener);
    }

    sendMessage(chatId, text, form) {
        return this.bot.sendMessage(chatId, text, form);
    }

    editMessageText(text, form) {
        return this.bot.editMessageText(text, form);
    }

    deleteMessage(chatId, messageId, form) {
        return this.bot.deleteMessage(chatId, messageId, form);
    }

    sendPhoto(chatId, src, params) {
        return this.bot.sendPhoto(chatId, src, params);
    }

    editMessageMedia(media, form) {
        return this.bot.editMessageMedia(media, form);
    }
}
