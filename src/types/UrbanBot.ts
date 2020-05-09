import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';

export type ProcessUpdate<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent> = (
    event: UrbanSyntheticEvent<NativeEvent>,
) => void;

export interface UrbanBotMeta<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBot<Metadata extends UrbanBotMeta = UrbanBotMeta> {
    type: Metadata['NativeEvent']['type'];
    processUpdate: ProcessUpdate<Metadata['NativeEvent']>;
    sendMessage: (message: UrbanMessage) => Promise<Metadata['MessageMeta']>;
    updateMessage: (message: UrbanExistingMessage<Metadata['MessageMeta']>) => void;
    deleteMessage: (message: UrbanExistingMessage<Metadata['MessageMeta']>) => void;
}
