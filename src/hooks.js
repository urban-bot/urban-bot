import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

export function useMessage(func, dependencies = [], bot) {
    const { userId, bot: botFromContext } = useBotContext();

    const neededBot = bot || botFromContext

    const handler = function(ctx) {
        const chatId = ctx.chat.id;
        // console.log('handler', ctx);
        // console.log('userId', userId);
        // console.log('chatId', chatId);
        // console.log('botFromContext', botFromContext);

        if (!userId || chatId === userId) {
            func(ctx);
        }
    };

    React.useEffect(() => {
        neededBot.on('message', handler);

        return () => {
            neededBot.removeListener('message', handler);
        };
    }, dependencies);
}
