import type { Express } from 'express';
import type { UrbanBotType } from './UrbanBotType';
import type { ProcessUpdate } from './ProcessUpdate';
import type { UrbanCommand } from './UrbanCommand';
import type { UrbanParseMode } from './UrbanParseMode';
import { UrbanExistingMessage, UrbanMessage } from '../index';

export type UrbanBot<BotType extends UrbanBotType = UrbanBotType> = {
    type: BotType['NativeEvent']['type'];
    defaultParseMode?: UrbanParseMode;
    commandPrefix: string;
    processUpdate: ProcessUpdate<BotType>;
    sendMessage: (message: UrbanMessage) => Promise<BotType['MessageMeta']>;
    updateMessage?: (message: UrbanExistingMessage<BotType>) => any;
    deleteMessage?: (message: UrbanExistingMessage<BotType>) => any;
    initializeCommands?: (commands: UrbanCommand[]) => Promise<unknown>;
    initializeServer?: (expressApp: Express) => void;
};
