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
        const [id] = args;

        return this.promiseQueueMap[id].next(() => {
            return this.bot.sendMessage(...args);
        });
    }

    editMessageText(...args) {
        return this.bot.editMessageText(...args);
    }

    deleteMessage(...args) {
        return this.bot.deleteMessage(...args);
    }

    sendPhoto(...args) {
        const [id] = args;
        return this.promiseQueueMap[id].next(() => {
            return this.bot.sendPhoto(...args);
        });
    }

    editMessageMedia(...args) {
        return this.bot.editMessageMedia(...args);
    }
}
