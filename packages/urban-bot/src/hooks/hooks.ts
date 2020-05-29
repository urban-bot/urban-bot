import React from 'react';
import { BotContextType, getBotContext, RouterContext } from '../context';
import {
    UrbanListener,
    UrbanSyntheticEvent,
    UrbanListenerByType,
    UrbanSyntheticEventType,
    UrbanListenerByNativeEventWithSpreadPayload,
    UrbanEventListener,
    UrbanBotType,
} from '../types';

export function useBotContext<BotType extends UrbanBotType>(): BotContextType<BotType> {
    const BotContext = getBotContext<BotType>();
    const botContext = React.useContext(BotContext);

    if (botContext === undefined) {
        throw new Error('You should use useBotContext only under Root component');
    }

    return botContext;
}

export function useRouter() {
    const routerContext = React.useContext(RouterContext);

    if (routerContext === undefined) {
        throw new Error('You should use useBotContext only under Router component');
    }

    return routerContext;
}

function useSubscribe<
    BotType extends UrbanBotType,
    Event extends UrbanSyntheticEvent<BotType> = UrbanSyntheticEvent<BotType>
>(listener: UrbanListener<Event>, event: Event['type']) {
    const { chat, $$managerBot } = useBotContext<BotType>();

    React.useEffect(() => {
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
        listener({
            ...other,
            ...payload,
        });
    }, eventType);
}

export function useAnyEvent<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'any'>) {
    useSubscribeWithSpreadPayload(listener, 'any');
}

export function useText<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'text'>) {
    useSubscribeWithSpreadPayload(listener, 'text');
}

export function useCommand<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'command'>) {
    useSubscribeWithSpreadPayload(listener, 'command');
}

export function useSticker<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'sticker'>) {
    useSubscribeWithSpreadPayload(listener, 'sticker');
}

export function useAnimation<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'animation'>) {
    useSubscribeWithSpreadPayload(listener, 'animation');
}

export function useAudio<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'audio'>) {
    useSubscribeWithSpreadPayload(listener, 'audio');
}

export function useContact<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'contact'>) {
    useSubscribeWithSpreadPayload(listener, 'contact');
}

export function useFile<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'file'>) {
    useSubscribeWithSpreadPayload(listener, 'file');
}

export function useInvoice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'invoice'>) {
    useSubscribeWithSpreadPayload(listener, 'invoice');
}

export function useLocation<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'location'>) {
    useSubscribeWithSpreadPayload(listener, 'location');
}

export function useImage<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'image'>) {
    useSubscribeWithSpreadPayload(listener, 'image');
}

export function usePoll<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'poll'>) {
    useSubscribeWithSpreadPayload(listener, 'poll');
}

export function useVideo<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'video'>) {
    useSubscribeWithSpreadPayload(listener, 'video');
}

export function useVoice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'voice'>) {
    useSubscribeWithSpreadPayload(listener, 'voice');
}

export function useDice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'dice'>) {
    useSubscribeWithSpreadPayload(listener, 'dice');
}

export function useAction<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'action'>) {
    useSubscribeWithSpreadPayload(listener, 'action');
}
