class PromiseQueue {
    constructor() {
        this.last = Promise.resolve();
    }

    next(promise) {
        const current = this.last.then(promise);
        this.last = current;

        return current;
    }
}

export class AbstractBot {
    constructor(bot) {
        this.bot = bot;

        this.promiseQueueMap = {};
    }

    addPromiseQueue(id) {
        this.promiseQueueMap[id] = new PromiseQueue();
    }

    deletePromiseQueue(id) {
        delete this.promiseQueueMap[id];
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
