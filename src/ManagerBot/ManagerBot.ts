import { PromiseQueue } from './PromiseQueue';
import EventEmitter from 'events';
import { ProcessUpdate, UrbanBot } from '../types/UrbanBot';
import { UrbanExistingMessage, UrbanMessage } from '../types/Messages';
import { UrbanListener } from '../types';
import { UrbanEvent } from '../types/Events';

type Chat = {
    eventEmitter: EventEmitter;
    promiseQueue: PromiseQueue;
};

export class ManagerBot<Type = unknown, NativeEventPayload = unknown, Meta = unknown> {
    private chats = new Map<string, Chat>();
    private eventEmitter: EventEmitter;

    constructor(private bot: UrbanBot<Type, NativeEventPayload, Meta>) {
        this.eventEmitter = new EventEmitter();

        bot.initializeProcessUpdate(this.processUpdate);
    }

    processUpdate: ProcessUpdate<Type, NativeEventPayload> = (event) => {
        this.eventEmitter.emit('any', event);
        this.eventEmitter.emit(event.type);

        const { id } = event.chat;
        const chat = this.chats.get(id);

        if (chat === undefined) {
            throw new Error('Specify chatId via managerBot.addChat(chatId) to process messages for specific chat');
        }

        chat.eventEmitter.emit('any', event);
        chat.eventEmitter.emit(event.type, event);
    };

    addChat(id: string) {
        this.chats.set(id, { promiseQueue: new PromiseQueue(), eventEmitter: new EventEmitter() });
    }

    deleteChat(id: string) {
        this.chats.delete(id);
    }

    on<Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>>(
        eventName: Event['type'] | 'any',
        listener: UrbanListener<Event>,
        chatId?: string,
    ) {
        if (chatId === undefined) {
            return this.eventEmitter.on(eventName, listener);
        } else {
            const chat = this.chats.get(chatId);
            if (chat === undefined) {
                throw new Error(
                    'Specify chatId via managerBot.addChat(chatId) to subscribe on messages for specific chat',
                );
            }

            return chat.eventEmitter.on(eventName, listener);
        }
    }

    emit<Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>>(
        eventName: Event['type'] | 'any',
        event: Event,
    ) {
        this.eventEmitter.emit('any', event);
        this.eventEmitter.emit(eventName, event);
    }

    removeListener<Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>>(
        eventName: Event['type'] | 'any',
        listener: UrbanListener<Event>,
        chatId?: string,
    ) {
        if (chatId === undefined) {
            return this.eventEmitter.removeListener(eventName, listener);
        } else {
            const chat = this.chats.get(chatId);
            if (chat === undefined) {
                throw new Error('Specify chatId via managerBot.addChat(chatId) to sendMessage for specific chat');
            }

            return chat.eventEmitter.removeListener(eventName, listener);
        }
    }

    sendMessage(message: UrbanMessage): Promise<Meta> {
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
