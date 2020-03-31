import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

export function useMessage(func) {
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        function handler(ctx) {
            const chatId = ctx.chat.id;

            if (ctx.text && (!userId || chatId === userId)) {
                func(ctx);
            }
        }

        bot.on('message', handler);

        return () => {
            bot.removeListener('message', handler);
        };
    }, [func, bot, userId]);
}
