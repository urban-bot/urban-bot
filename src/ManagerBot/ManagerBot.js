import { PromiseQueue } from './PromiseQueue';
import EventEmitter from 'events';

export class ManagerBot extends EventEmitter {
    constructor(bot) {
        super();
        this.bot = bot;
        this.chats = new Map();

        bot.initializeProcessUpdate(this.processUpdate);
    }

    processUpdate = (event, data) => {
        super.emit('any', { realEvent: event, ...data });
        super.emit(event, data);

        const { id } = data.chat;
        const { eventEmitter } = this.chats.get(id);
        eventEmitter.emit('any', { realEvent: event, ...data });
        eventEmitter.emit(event, data);
    };

    addChat(id) {
        this.chats.set(id, { promiseQueue: new PromiseQueue(), eventEmitter: new EventEmitter() });
    }

    deleteChat(id) {
        this.chats.delete(id);
    }

    on(event, listener, chatId) {
        if (chatId === undefined) {
            return super.on(event, listener);
        } else {
            const { eventEmitter } = this.chats.get(chatId);
            eventEmitter.on(event, listener);
        }
    }

    removeListener(event, listener, chatId) {
        if (chatId === undefined) {
            return super.removeListener(event, listener);
        } else {
            const { eventEmitter } = this.chats.get(chatId);

            return eventEmitter.removeListener(event, listener);
        }
    }

    sendMessage(nodeName, chat, data) {
        const chatById = this.chats.get(chat.id);

        if (chatById === undefined) {
            throw new Error('Specify chatId before send message via managerBot.addChat(chatId)');
        }

        return chatById.promiseQueue.next(() => {
            return this.bot.sendMessage(nodeName, chat, data);
        });
    }

    updateMessage(nodeName, chat, data, meta) {
        return this.bot.updateMessage(nodeName, chat, data, meta);
    }

    deleteMessage(nodeName, chat, data, meta) {
        return this.bot.deleteMessage(nodeName, chat, data, meta);
    }
}
