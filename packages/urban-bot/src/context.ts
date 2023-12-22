import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import type { UrbanBotType, UrbanBot, UrbanChat, UrbanParseMode } from './types';

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

export type RouterQuery = Record<string, any>;
export type Navigate<Q = RouterQuery> = (name: string, query?: Q) => void;

export type RouterContext<P extends object = {}, Q = RouterQuery> = {
    navigate: Navigate<Q>;
    activePath: string;
    params?: P;
    history: string[];
    query: Q;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
