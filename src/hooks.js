import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

export function useMessage(func, dependencies = []) {
    const { userId, bot } = useBotContext();

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
