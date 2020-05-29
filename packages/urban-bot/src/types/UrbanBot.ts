import { UrbanNativeEvent, UrbanSyntheticEvent } from './Events';
import { UrbanMessage, UrbanExistingMessage } from './Messages';
import { UrbanCommand, UrbanParseMode } from './index';
import { Express } from 'express';

export type ProcessUpdate<BotType extends UrbanBotType> = (event: UrbanSyntheticEvent<BotType>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UrbanBotType<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = any> {
    NativeEvent: NativeEvent;
    MessageMeta: MessageMeta;
}

export interface UrbanBot<BotType extends UrbanBotType = UrbanBotType> {
    type: BotType['NativeEvent']['type'];
    defaultParseMode?: UrbanParseMode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processUpdate: ProcessUpdate<BotType>;
    sendMessage: (message: UrbanMessage) => Promise<BotType['MessageMeta']>;
    updateMessage?: (message: UrbanExistingMessage<BotType>) => any;
    deleteMessage?: (message: UrbanExistingMessage<BotType>) => any;
    initializeCommands?: (commands: UrbanCommand[]) => Promise<unknown>;
    initializeServer?: (expressApp: Express) => void;
}
