import React from 'react';
import { BotContextType, getBotContext, RouterContext } from '../context';
import {
    UrbanBot,
    UrbanListener,
    UrbanSyntheticEvent,
    UrbanListenerByType,
    UrbanNativeEvent,
    UrbanSyntheticEventType,
    UrbanListenerByNativeEventWithSpreadPayload,
    UrbanEventListener,
} from '../types';

export type BotMetaByBot<Bot extends UrbanBot> = Bot extends UrbanBot<infer BotMeta> ? BotMeta : never;

export function useBotContext<Bot extends UrbanBot>(): BotContextType<Bot> {
    const BotContext = getBotContext<Bot>();
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
    Bot extends UrbanBot,
    Event extends UrbanSyntheticEvent<BotMetaByBot<Bot>['NativeEvent']> = UrbanSyntheticEvent<
        BotMetaByBot<Bot>['NativeEvent']
    >
>(listener: UrbanListener<Event>, event: Event['type']) {
    const { chat, $$managerBot } = useBotContext<Bot>();

    React.useEffect(() => {
        $$managerBot.on(event, listener, chat.id);

        return () => {
            $$managerBot.removeListener(event, listener, chat.id);
        };
    }, [listener, $$managerBot, event, chat]);
}

export function useSubscribeWithSpreadPayload<
    NativeEvent extends UrbanNativeEvent,
    EventType extends UrbanSyntheticEventType<NativeEvent>,
    Event extends Parameters<UrbanListenerByType<NativeEvent, EventType>>[0]
>(listener: UrbanListenerByNativeEventWithSpreadPayload<NativeEvent, Event>, eventType: EventType) {
    useSubscribe<UrbanBot, Event>((event) => {
        const { payload, ...other } = event;
        listener({
            ...other,
            ...payload,
        });
    }, eventType);
}

export function useAny<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'any'>) {
    useSubscribe(listener, 'any');
}

export function useText<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'text'>) {
    useSubscribeWithSpreadPayload(listener, 'text');
}

export function useCommand<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'command'>) {
    useSubscribeWithSpreadPayload(listener, 'command');
}

export function useSticker<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'sticker'>) {
    useSubscribeWithSpreadPayload(listener, 'sticker');
}

export function useAnimation<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'animation'>) {
    useSubscribeWithSpreadPayload(listener, 'animation');
}

export function useAudio<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'audio'>) {
    useSubscribeWithSpreadPayload(listener, 'audio');
}

export function useContact<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'contact'>) {
    useSubscribeWithSpreadPayload(listener, 'contact');
}

export function useFile<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'file'>) {
    useSubscribeWithSpreadPayload(listener, 'file');
}

export function useInvoice<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'invoice'>) {
    useSubscribeWithSpreadPayload(listener, 'invoice');
}

export function useLocation<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'location'>) {
    useSubscribeWithSpreadPayload(listener, 'location');
}

export function useImage<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'image'>) {
    useSubscribeWithSpreadPayload(listener, 'image');
}

export function usePoll<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'poll'>) {
    useSubscribeWithSpreadPayload(listener, 'poll');
}

export function useVideo<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'video'>) {
    useSubscribeWithSpreadPayload(listener, 'video');
}

export function useVoice<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'voice'>) {
    useSubscribeWithSpreadPayload(listener, 'voice');
}

export function useDice<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'dice'>) {
    useSubscribeWithSpreadPayload(listener, 'dice');
}

export function useAction<Bot extends UrbanBot>(listener: UrbanEventListener<Bot, 'action'>) {
    useSubscribeWithSpreadPayload(listener, 'action');
}
