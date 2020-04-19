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

    processUpdate = (data) => {
        super.emit('any', { realEvent: data.type, ...data });
        super.emit(data.type, data);
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

    sendMessage(nodeName, chat, data) {
        const promiseQueueByChatId = this.chats.get(chat.id);

        if (promiseQueueByChatId === undefined) {
            throw new Error('Specify chatId before send message via managerBot.addChat(chatId)');
        }

        return promiseQueueByChatId.next(() => {
            return this.bot.sendMessage({ nodeName, chat, data });
        });
    }

    updateMessage(nodeName, chat, data, meta) {
        return this.bot.updateMessage({ nodeName, chat, data, meta });
    }

    deleteMessage(nodeName, chat, data, meta) {
        return this.bot.deleteMessage({ nodeName, chat, data, meta });
    }
}
