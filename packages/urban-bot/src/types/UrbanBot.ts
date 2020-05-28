import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';
import { UrbanCommand, UrbanParseMode } from './index';
import { Express } from 'express';

export type ProcessUpdate<Metadata extends UrbanBotMeta> = (event: UrbanSyntheticEvent<Metadata>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UrbanBotMeta<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = any> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBot<Metadata extends UrbanBotMeta = UrbanBotMeta> {
    type: Metadata['NativeEvent']['type'];
    defaultParseMode?: UrbanParseMode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processUpdate: ProcessUpdate<Metadata>;
    sendMessage: (message: UrbanMessage) => Promise<Metadata['MessageMeta']>;
    updateMessage?: (message: UrbanExistingMessage<Metadata>) => any;
    deleteMessage?: (message: UrbanExistingMessage<Metadata>) => any;
    initializeCommands?: (commands: UrbanCommand[]) => Promise<unknown>;
    initializeServer?: (expressApp: Express) => void;
}
