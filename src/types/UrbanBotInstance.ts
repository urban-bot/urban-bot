import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent> = (
    event: UrbanSyntheticEvent<NativeEvent>,
) => void;

export interface UrbanBot<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = any> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBotInstance<Bot extends UrbanBot> {
    type: Bot['NativeEvent']['type'];
    processUpdate: ProcessUpdate<Bot['NativeEvent']>;
    sendMessage: (message: UrbanMessage) => Promise<Bot['MessageMeta']>;
    updateMessage: (message: UrbanExistingMessage<Bot['MessageMeta']>) => void;
    deleteMessage: (message: UrbanExistingMessage<Bot['MessageMeta']>) => void;
}
