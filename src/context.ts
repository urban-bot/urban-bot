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

let BotContext: any;

export function getBotContext<Type = unknown, NativeEventPayload = unknown, Meta = unknown>() {
    if (BotContext === undefined) {
        BotContext = React.createContext<BotContextType<Type, NativeEventPayload, Meta> | undefined>(undefined);
    }

    return BotContext as React.Context<BotContextType<Type, NativeEventPayload, Meta>>;
}

export type RouterContext = {
    navigate: (path: string) => void;
    activePath: string;
};

export const RouterContext = React.createContext<RouterContext | undefined>(undefined);
