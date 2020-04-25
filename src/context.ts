import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';
import { UrbanNativeEvent } from './types/Events';

export type BotContextType<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown> = {
    $$managerBot: ManagerBot<NativeEvent, MessageMeta>;
    chat: UrbanChat;
    from?: UrbanFrom;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    bot: UrbanBot<NativeEvent, MessageMeta>;
};

export const BotContext = React.createContext(undefined);

export function getBotContext<NativeEvent extends UrbanNativeEvent, MessageMeta = unknown>() {
    return (BotContext as unknown) as React.Context<BotContextType<NativeEvent, MessageMeta>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
