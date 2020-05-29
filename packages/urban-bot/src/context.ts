import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBotType, UrbanChat, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';

export type BotContextType<BotType extends UrbanBotType> = {
    $$managerBot: ManagerBot<BotType>;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode?: UrbanParseMode;
    bot: UrbanBot<BotType>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<BotType extends UrbanBotType>() {
    return (BotContext as unknown) as React.Context<BotContextType<BotType>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
