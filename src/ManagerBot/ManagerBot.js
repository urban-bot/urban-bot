import { PromiseQueue } from './PromiseQueue';

export class ManagerBot {
    constructor(bot) {
        this.bot = bot;
        this.promiseQueueMap = new Map();
    }

    addChat(id) {
        this.promiseQueueMap.set(id, new PromiseQueue());
    }

    deleteChat(id) {
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

    sendMessage(nodeName, chatId, data) {
        return this.promiseQueueMap.get(chatId).next(() => {
            return this.bot.sendMessage(nodeName, chatId, data);
        });
    }

    updateMessage(nodeName, chatId, data, meta) {
        return this.bot.updateMessage(nodeName, chatId, data, meta);
    }

    deleteMessage(nodeName, chatId, data, meta) {
        return this.bot.deleteMessage(nodeName, chatId, data, meta);
    }
}
