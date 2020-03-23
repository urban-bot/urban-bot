import React from 'react';
import { BotContext } from './context';
import { bot } from './render';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useInput(func, dependencies = []) {
    React.useEffect(() => {
        bot.on('message', func);
    }, dependencies);
}
