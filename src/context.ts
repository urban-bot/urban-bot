import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';

export type BotContextType<Type = unknown, NativeEventPayload = unknown, MessageMeta = unknown> = {
    $$managerBot: ManagerBot<Type, NativeEventPayload, MessageMeta>;
    chat: UrbanChat;
    from?: UrbanFrom;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    bot: UrbanBot<Type, NativeEventPayload, MessageMeta>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<Type = unknown, NativeEventPayload = unknown, MessageMeta = unknown>() {
    return (BotContext as unknown) as React.Context<BotContextType<Type, NativeEventPayload, MessageMeta>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
