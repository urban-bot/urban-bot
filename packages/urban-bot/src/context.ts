import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBotMeta, UrbanChat, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';

export type BotContextType<Metadata extends UrbanBotMeta> = {
    $$managerBot: ManagerBot<Metadata>;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode?: UrbanParseMode;
    bot: UrbanBot<Metadata>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<Metadata extends UrbanBotMeta>() {
    return (BotContext as unknown) as React.Context<BotContextType<Metadata>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
