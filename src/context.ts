import React from 'react';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from './types';
import { UrbanBot } from './types/UrbanBot';

export type BotContextType<Type = unknown, NativeEventPayload = unknown, Meta = unknown> = {
    $$managerBot: ManagerBot<Type, NativeEventPayload, Meta>;
    chat: UrbanChat;
    from?: UrbanFrom;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    bot: UrbanBot<Type, NativeEventPayload, Meta>;
};

export function getBotContext<Type = unknown, NativeEventPayload = unknown, Meta = unknown>() {
    return React.createContext<BotContextType<Type, NativeEventPayload, Meta> | undefined>(undefined);
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
