import { PromiseQueue } from './PromiseQueue';
import EventEmitter from 'events';

export class ManagerBot extends EventEmitter {
    constructor(bot) {
        super();
        this.bot = bot;
        this.chats = new Map();

        bot.initializeProcessUpdate(this.processUpdate);

        this.listenersMap = new Map();
    }

    processUpdate = (event, data) => {
        super.emit('any', { realEvent: event, ...data });
        super.emit(event, data);
    };

    addChat(id) {
        this.chats.set(id, new PromiseQueue());
    }

    deleteChat(id) {
        this.chats.delete(id);
    }

    on(event, listener, eventId, chatId) {
        function listenerGuard(ctx) {
            if (chatId !== undefined) {
                const { id: chatIdFromEvent } = ctx.chat;

                if (chatId !== chatIdFromEvent) {
                    return;
                }
            }

            listener(ctx);
        }
        this.listenersMap.set(eventId, listenerGuard);

        return super.on(event, listenerGuard);
    }

    removeListener(event, listener, eventId) {
        const listenerGuard = this.listenersMap.get(eventId);
        this.listenersMap.delete(eventId);

        return super.removeListener(event, listenerGuard);
    }

    sendMessage(nodeName, chatId, data) {
        const promiseQueueByChatId = this.chats.get(chatId);

        if (promiseQueueByChatId === undefined) {
            throw new Error('Specify chatId before send message via managerBot.addChat(chatId)');
        }

        return promiseQueueByChatId.next(() => {
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
