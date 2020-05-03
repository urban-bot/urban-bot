import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from './types';
import { UrbanBotType, UrbanBot } from './types/UrbanBot';

export type BotContextType<Bot extends UrbanBotType> = {
    $$managerBot: ManagerBot<Bot>;
    chat: UrbanChat;
    from?: UrbanFrom;
    isNewMessageEveryRender: boolean;
    parseMode?: UrbanParseMode;
    bot: UrbanBot<Bot>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<Bot extends UrbanBotType>() {
    return (BotContext as unknown) as React.Context<BotContextType<Bot>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
