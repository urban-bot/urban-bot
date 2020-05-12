import { PromiseQueue } from './PromiseQueue';
import { EventEmitter } from 'events';
import { ProcessUpdate, UrbanBot } from '../types/UrbanBot';
import { UrbanExistingMessage, UrbanMessage } from '../types/Messages';
import { UrbanListener } from '../types';
import { UrbanSyntheticEvent } from '../types/Events';
import { BotMetaByBot } from '../hooks/hooks';
import { debounce } from 'lodash';

type Chat = {
    eventEmitter: EventEmitter;
    promiseQueue: PromiseQueue;
    updateMessage: UrbanBot['updateMessage'];
};

export class ManagerBot<Bot extends UrbanBot = any> {
    private chats = new Map<string, Chat>();
    private eventEmitter: EventEmitter;

    constructor(private bot: Bot) {
        this.eventEmitter = new EventEmitter();

        bot.processUpdate = this.processUpdate;
    }

    processUpdate: ProcessUpdate<BotMetaByBot<Bot>['NativeEvent']> = (event) => {
        this.eventEmitter.emit('any', event);
        this.eventEmitter.emit(event.type, event);

        const { id } = event.chat;
        const chat = this.chats.get(id);

        if (chat === undefined) {
            return;
        }

        chat.eventEmitter.emit('any', event);
        chat.eventEmitter.emit(event.type, event);
    };

    addChat(id: string) {
        this.chats.set(id, {
            promiseQueue: new PromiseQueue(),
            eventEmitter: new EventEmitter(),
            updateMessage: debounce((message: UrbanExistingMessage) => this.bot.updateMessage(message), 50),
        });
    }

    deleteChat(id: string) {
        this.chats.delete(id);
    }

    on<
        Event extends UrbanSyntheticEvent<BotMetaByBot<Bot>['NativeEvent']> = UrbanSyntheticEvent<
            BotMetaByBot<Bot>['NativeEvent']
        >
    >(eventName: Event['type'] | 'any', listener: UrbanListener<Event>, chatId?: string) {
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

    emit<
        Event extends UrbanSyntheticEvent<BotMetaByBot<Bot>['NativeEvent']> = UrbanSyntheticEvent<
            BotMetaByBot<Bot>['NativeEvent']
        >
    >(eventName: Event['type'] | 'any', event: Event, chatId?: string) {
        this.eventEmitter.emit('any', event);
        this.eventEmitter.emit(eventName, event);

        if (chatId !== undefined) {
            const chat = this.chats.get(chatId);

            if (chat === undefined) {
                throw new Error('Specify chatId via managerBot.addChat(chatId) to emit messages for specific chat');
            }

            chat.eventEmitter.emit('any', event);
            chat.eventEmitter.emit(event.type, event);
        }
    }

    removeListener<
        Event extends UrbanSyntheticEvent<BotMetaByBot<Bot>['NativeEvent']> = UrbanSyntheticEvent<
            BotMetaByBot<Bot>['NativeEvent']
        >
    >(eventName: Event['type'] | 'any', listener: UrbanListener<Event>, chatId?: string) {
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

    sendMessage(message: UrbanMessage): Promise<BotMetaByBot<Bot>['MessageMeta']> {
        const chatById = this.chats.get(message.chat.id);

        if (chatById === undefined) {
            throw new Error('Specify chatId via managerBot.addChat(chatId) to sendMessage for specific chat');
        }

        return chatById.promiseQueue.next<BotMetaByBot<Bot>['MessageMeta']>(() => {
            return this.bot.sendMessage(message);
        });
    }

    updateMessage(message: UrbanExistingMessage<BotMetaByBot<Bot>['MessageMeta']>) {
        const chatById = this.chats.get(message.chat.id);

        if (chatById === undefined) {
            throw new Error('Specify chatId via managerBot.addChat(chatId) to updateMessage for specific chat');
        }

        chatById.updateMessage(message);
    }

    deleteMessage(message: UrbanExistingMessage<BotMetaByBot<Bot>['MessageMeta']>) {
        return this.bot.deleteMessage(message);
    }
}
