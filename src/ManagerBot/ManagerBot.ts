import { PromiseQueue } from './PromiseQueue';
import EventEmitter from 'events';
import { ProcessUpdate, UrbanBot } from '../types/UrbanBot';
import { UrbanExistingMessage, UrbanNewMessage } from '../types/Messages';
import { UrbanListener } from '../types';
import { UrbanEvent } from '../types/Events';

type Chat = {
    eventEmitter: EventEmitter;
    promiseQueue: PromiseQueue;
};

export class ManagerBot<Type, NativeEventPayload, Meta> {
    private chats = new Map<string, Chat>();
    private eventEmitter: EventEmitter;

    constructor(private bot: UrbanBot<Type, NativeEventPayload, Meta>) {
        this.eventEmitter = new EventEmitter();

        bot.initializeProcessUpdate(this.processUpdate);
    }

    processUpdate: ProcessUpdate<Type, NativeEventPayload> = (data) => {
        this.eventEmitter.emit('any', { realEvent: data.type, ...data });
        this.eventEmitter.emit(data.type);

        const { id } = data.chat;
        const chat = this.chats.get(id);

        if (chat === undefined) {
            throw new Error('Specify chatId via managerBot.addChat(chatId) to process messages for specific chat');
        }

        chat.eventEmitter.emit('any', { realEvent: data.type, ...data });
        chat.eventEmitter.emit(data.type, data);
    };

    addChat(id: string) {
        this.chats.set(id, { promiseQueue: new PromiseQueue(), eventEmitter: new EventEmitter() });
    }

    deleteChat(id: string) {
        this.chats.delete(id);
    }

    on<Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>>(
        event: Event['type'] | 'any',
        listener: UrbanListener<Event>,
        chatId?: string,
    ) {
        if (chatId === undefined) {
            return this.eventEmitter.on(event, listener);
        } else {
            const chat = this.chats.get(chatId);
            if (chat === undefined) {
                throw new Error(
                    'Specify chatId via managerBot.addChat(chatId) to subscribe on messages for specific chat',
                );
            }

            return chat.eventEmitter.on(event, listener);
        }
    }

    removeListener<Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>>(
        event: Event['type'] | 'any',
        listener: UrbanListener<Event>,
        chatId?: string,
    ) {
        if (chatId === undefined) {
            return this.eventEmitter.removeListener(event, listener);
        } else {
            const chat = this.chats.get(chatId);
            if (chat === undefined) {
                throw new Error('Specify chatId via managerBot.addChat(chatId) to sendMessage for specific chat');
            }

            return chat.eventEmitter.removeListener(event, listener);
        }
    }

    sendMessage(message: UrbanNewMessage) {
        const chatById = this.chats.get(message.chat.id);

        if (chatById === undefined) {
            throw new Error('Specify chatId via managerBot.addChat(chatId) to sendMessage for specific chat');
        }

        return chatById.promiseQueue.next(() => {
            return this.bot.sendMessage(message);
        });
    }

    updateMessage(message: UrbanExistingMessage<Meta>) {
        return this.bot.updateMessage(message);
    }

    deleteMessage(message: UrbanExistingMessage<Meta>) {
        return this.bot.deleteMessage(message);
    }
}
