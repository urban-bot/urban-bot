import { PromiseQueue } from "./PromiseQueue";

export class AbstractBot {
    constructor(bot) {
        this.bot = bot;
        this.promiseQueueMap = new Map();
    }

    addUser(id) {
        this.promiseQueueMap.set(id, new PromiseQueue());
    }

    deleteUser(id) {
        this.promiseQueueMap.delete(id);
    }

    on(event, listener) {
        return this.bot.on(event, listener);
    }

    emit(type, message) {
        return this.bot.emit(type, message);
    }

    removeListener(eventName, listener) {
        return this.bot.removeListener(eventName, listener);
    }

    sendMessage(chatId, text, form) {
        return this.promiseQueueMap[chatId].next(() => {
            return this.bot.sendMessage(chatId, text, form);
        });
    }

    editMessageText(text, form) {
        return this.bot.editMessageText(text, form);
    }

    deleteMessage(chatId, messageId, form) {
        return this.bot.deleteMessage(chatId, messageId, form);
    }

    sendPhoto(chatId, src, params) {
        return this.promiseQueueMap[chatId].next(() => {
            return this.bot.sendPhoto(chatId, src, params);
        });
    }

    editMessageMedia(media, form) {
        return this.bot.editMessageMedia(media, form);
    }
}
