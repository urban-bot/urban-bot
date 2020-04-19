import { UrbanEvent } from './Events';
import { UrbanBotNewMessage, UrbanBotExistingMessage } from './Messages';

export type ProcessUpdate<Type, NativeEventPayload> = (event: UrbanEvent<Type, NativeEventPayload>) => void;

export interface UrbanBot<Type, NativeEventPayload, Meta> {
    processUpdate: ProcessUpdate<Type, NativeEventPayload>;
    initializeProcessUpdate: (processUpdate: ProcessUpdate<Type, NativeEventPayload>) => void;
    sendMessage: (message: UrbanBotNewMessage) => Promise<Meta>;
    updateMessage: (message: UrbanBotExistingMessage<Meta>) => void;
    deleteMessage: (message: UrbanBotExistingMessage<Meta>) => void;
}
