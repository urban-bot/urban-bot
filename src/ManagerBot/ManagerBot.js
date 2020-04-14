import { PromiseQueue } from './PromiseQueue';

export class ManagerBot {
    constructor(bot) {
        this.bot = bot;
        this.chats = new Map();
    }

    addChat(id) {
        this.chats.set(id, new PromiseQueue());
    }

    deleteChat(id) {
        this.chats.delete(id);
    }

    on(event, listener, chatId) {
        return this.bot.on(event, function(ctx) {
            if (chatId !== undefined) {
                const { id: chatIdFromEvent } = ctx.chat;

                if (chatId !== chatIdFromEvent) {
                    return;
                }
            }

            listener(ctx);
        });
    }

    emit(type, message) {
        return this.bot.emit(type, message);
    }

    removeListener(eventName, listener) {
        return this.bot.removeListener(eventName, listener);
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
