import { UrbanEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<Type = unknown, NativeEventPayload = unknown> = (
    event: UrbanEvent<Type, NativeEventPayload>,
) => void;

export interface UrbanBot<Type = unknown, NativeEventPayload = unknown, MessageMeta = unknown> {
    type: string;
    processUpdate: ProcessUpdate<Type, NativeEventPayload>;
    sendMessage: (message: UrbanMessage) => Promise<MessageMeta>;
    updateMessage: (message: UrbanExistingMessage<MessageMeta>) => void;
    deleteMessage: (message: UrbanExistingMessage<MessageMeta>) => void;
}
