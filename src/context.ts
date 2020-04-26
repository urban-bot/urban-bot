import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from './types';
import { UrbanBot, UrbanBotInstance } from './types/UrbanBotInstance';

export type BotContextType<Bot extends UrbanBot> = {
    $$managerBot: ManagerBot<Bot>;
    chat: UrbanChat;
    from?: UrbanFrom;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    bot: UrbanBotInstance<Bot>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<Bot extends UrbanBot>() {
    return (BotContext as unknown) as React.Context<BotContextType<Bot>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
