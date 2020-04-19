import { UrbanEvent } from './Events';
import { UrbanNewMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<Type, NativeEventPayload> = (event: UrbanEvent<Type, NativeEventPayload>) => void;

export interface UrbanBot<Type, NativeEventPayload, Meta> {
    processUpdate: ProcessUpdate<Type, NativeEventPayload>;
    initializeProcessUpdate: (processUpdate: ProcessUpdate<Type, NativeEventPayload>) => void;
    sendMessage: (message: UrbanNewMessage) => Promise<Meta>;
    updateMessage: (message: UrbanExistingMessage<Meta>) => void;
    deleteMessage: (message: UrbanExistingMessage<Meta>) => void;
}
