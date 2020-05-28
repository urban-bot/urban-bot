import React from 'react';
import { BotContextType, getBotContext, RouterContext } from '../context';
import {
    UrbanListener,
    UrbanSyntheticEvent,
    UrbanListenerByType,
    UrbanSyntheticEventType,
    UrbanListenerByNativeEventWithSpreadPayload,
    UrbanEventListener,
    UrbanBotMeta,
} from '../types';

export function useBotContext<Metadata extends UrbanBotMeta>(): BotContextType<Metadata> {
    const BotContext = getBotContext<Metadata>();
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
    Metadata extends UrbanBotMeta,
    Event extends UrbanSyntheticEvent<Metadata> = UrbanSyntheticEvent<Metadata>
>(listener: UrbanListener<Event>, event: Event['type']) {
    const { chat, $$managerBot } = useBotContext<Metadata>();

    React.useEffect(() => {
        $$managerBot.on(event, listener, chat.id);

        return () => {
            $$managerBot.removeListener(event, listener, chat.id);
        };
    }, [listener, $$managerBot, event, chat]);
}

export function useSubscribeWithSpreadPayload<
    Metadata extends UrbanBotMeta,
    EventType extends UrbanSyntheticEventType<Metadata>,
    Event extends Parameters<UrbanListenerByType<Metadata, EventType>>[0]
>(listener: UrbanListenerByNativeEventWithSpreadPayload<Metadata, Event>, eventType: EventType) {
    useSubscribe<Metadata, Event>((event) => {
        const { payload, ...other } = event;
        listener({
            ...other,
            ...payload,
        });
    }, eventType);
}

export function useAny<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'any'>) {
    useSubscribeWithSpreadPayload(listener, 'any');
}

export function useText<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'text'>) {
    useSubscribeWithSpreadPayload(listener, 'text');
}

export function useCommand<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'command'>) {
    useSubscribeWithSpreadPayload(listener, 'command');
}

export function useSticker<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'sticker'>) {
    useSubscribeWithSpreadPayload(listener, 'sticker');
}

export function useAnimation<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'animation'>) {
    useSubscribeWithSpreadPayload(listener, 'animation');
}

export function useAudio<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'audio'>) {
    useSubscribeWithSpreadPayload(listener, 'audio');
}

export function useContact<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'contact'>) {
    useSubscribeWithSpreadPayload(listener, 'contact');
}

export function useFile<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'file'>) {
    useSubscribeWithSpreadPayload(listener, 'file');
}

export function useInvoice<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'invoice'>) {
    useSubscribeWithSpreadPayload(listener, 'invoice');
}

export function useLocation<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'location'>) {
    useSubscribeWithSpreadPayload(listener, 'location');
}

export function useImage<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'image'>) {
    useSubscribeWithSpreadPayload(listener, 'image');
}

export function usePoll<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'poll'>) {
    useSubscribeWithSpreadPayload(listener, 'poll');
}

export function useVideo<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'video'>) {
    useSubscribeWithSpreadPayload(listener, 'video');
}

export function useVoice<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'voice'>) {
    useSubscribeWithSpreadPayload(listener, 'voice');
}

export function useDice<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'dice'>) {
    useSubscribeWithSpreadPayload(listener, 'dice');
}

export function useAction<Metadata extends UrbanBotMeta>(listener: UrbanEventListener<Metadata, 'action'>) {
    useSubscribeWithSpreadPayload(listener, 'action');
}
