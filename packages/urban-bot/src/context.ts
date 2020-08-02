import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBotType, UrbanChat, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';

export type BotContextType<Bot extends UrbanBot, BotType extends UrbanBotType = UrbanBotType> = {
    $$managerBot: ManagerBot<BotType>;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode?: UrbanParseMode;
    bot: Bot;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<Bot extends UrbanBot = UrbanBot, BotType extends UrbanBotType = UrbanBotType>() {
    return (BotContext as unknown) as React.Context<BotContextType<Bot, BotType>>;
}

export type RouterContext<Params extends object = {}> = {
    navigate: (path: string) => void;
    activePath: string;
    params?: Params;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
