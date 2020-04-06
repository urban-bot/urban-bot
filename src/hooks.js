import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

export function useText(func) {
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        function handler(ctx) {
            const { id } = ctx.from;

            if (id === userId) {
                func(ctx);
            }
        }

        bot.on('text', handler);

        return () => {
            bot.removeListener('text', handler);
        };
    }, [func, bot, userId]);
}
