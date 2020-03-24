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
    React.useEffect(() => {
        bot.on('message', func);
    }, dependencies);
}
