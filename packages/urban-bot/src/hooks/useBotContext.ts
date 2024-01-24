import { useContext } from 'react';
import { getBotContext } from '../context';
import type { BotContextType } from '../context';
import type { UrbanBot, UrbanBotType } from '../types';

export function useBotContext<
    Bot extends UrbanBot = UrbanBot,
    BotType extends UrbanBotType = UrbanBotType
>(): BotContextType<Bot, BotType> {
    const BotContext = getBotContext<Bot, BotType>();
    const botContext = useContext(BotContext);

    if (botContext === undefined) {
        throw new Error('You should use useBotContext only under Root component');
    }

    return botContext;
}
