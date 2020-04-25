import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent> = (
    event: UrbanSyntheticEvent<NativeEvent>,
) => void;

export interface UrbanBot<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown> {
    type: string;
    processUpdate: ProcessUpdate<NativeEvent>;
    sendMessage: (message: UrbanMessage) => Promise<MessageMeta>;
    updateMessage: (message: UrbanExistingMessage<MessageMeta>) => void;
    deleteMessage: (message: UrbanExistingMessage<MessageMeta>) => void;
}
