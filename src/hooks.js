import React from 'react';
import { BotContext, RouterContext } from './context';
import { bot } from './render';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

export function useInput(func, dependencies) {
    const { userId } = useBotContext();

    const handler = function(ctx) {
        const chatId = ctx.chat.id;

        if (!userId || chatId === userId) {
            func(ctx);
        }
    };

    React.useEffect(() => {
        bot.on('message', handler);

        return () => {
            bot.removeListener('message', handler);
        };
    }, dependencies);
}
