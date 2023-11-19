import { useEffect } from 'react';
import { useBotContext } from './useBotContext';
import type {
    UrbanBot,
    UrbanBotType,
    UrbanListener,
    UrbanListenerByType,
    UrbanSyntheticEvent,
    UrbanSyntheticEventType,
    UrbanListenerByNativeEventWithSpreadPayload,
} from '../types';

function useSubscribe<
    BotType extends UrbanBotType,
    Event extends UrbanSyntheticEvent<BotType> = UrbanSyntheticEvent<BotType>
>(listener: UrbanListener<Event>, event: Event['type']) {
    const { chat, $$managerBot } = useBotContext<UrbanBot, BotType>();

    useEffect(() => {
        $$managerBot.on(event, listener, chat.id);

        return () => {
            $$managerBot.removeListener(event, listener, chat.id);
        };
    }, [listener, $$managerBot, event, chat]);
}

export function useSubscribeWithSpreadPayload<
    BotType extends UrbanBotType,
    EventType extends UrbanSyntheticEventType<BotType>,
    Event extends Parameters<UrbanListenerByType<BotType, EventType>>[0]
>(listener: UrbanListenerByNativeEventWithSpreadPayload<BotType, Event>, eventType: EventType) {
    useSubscribe<BotType, Event>((event) => {
        const { payload, ...other } = event;

        const eventData = { ...other, ...payload };

        listener(eventData);
    }, eventType);
}
