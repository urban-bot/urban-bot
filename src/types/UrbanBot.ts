import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent> = (
    event: UrbanSyntheticEvent<NativeEvent>,
) => void;

export interface UrbanBotType<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBot<Bot extends UrbanBotType> {
    type: Bot['NativeEvent']['type'];
    processUpdate: ProcessUpdate<Bot['NativeEvent']>;
    sendMessage: (message: UrbanMessage) => Promise<Bot['MessageMeta']>;
    updateMessage: (message: UrbanExistingMessage<Bot['MessageMeta']>) => void;
    deleteMessage: (message: UrbanExistingMessage<Bot['MessageMeta']>) => void;
}
