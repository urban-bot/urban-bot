import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';
import { UrbanCommand, UrbanParseMode } from './index';
import { Express } from 'express';

export type ProcessUpdate<Bot extends UrbanBot> = (event: UrbanSyntheticEvent<Bot>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UrbanBotMeta<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = any> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBot<Metadata extends UrbanBotMeta = UrbanBotMeta> {
    type: Metadata['NativeEvent']['type'];
    defaultParseMode?: UrbanParseMode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processUpdate: ProcessUpdate<UrbanBot<any>>;
    sendMessage: (message: UrbanMessage) => Promise<Metadata['MessageMeta']>;
    updateMessage?: (message: UrbanExistingMessage<Metadata['MessageMeta']>) => void;
    deleteMessage?: (message: UrbanExistingMessage<Metadata['MessageMeta']>) => void;
    initializeCommands?: (commands: UrbanCommand[]) => Promise<unknown>;
    initializeServer?: (expressApp: Express) => void;
}
