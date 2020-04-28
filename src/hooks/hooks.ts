import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import {
    UrbanSyntheticEvent,
    UrbanListenerByType,
    UrbanNativeEvent,
    UrbanSyntheticEventType,
    UrbanListenerByNativeEventWithSpreadPayload,
    UrbanListenerByTypeWithSpreadPayload,
} from '../types/Events';
import { UrbanBotType } from '../types/UrbanBot';

export function useBotContext<Bot extends UrbanBotType>() {
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
    Bot extends UrbanBotType,
    Event extends UrbanSyntheticEvent<Bot['NativeEvent']> = UrbanSyntheticEvent<Bot['NativeEvent']>
>(listener: UrbanListener<Event>, event: Event['type'] | 'any') {
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
    useSubscribe<UrbanBotType, Event>((event) => {
        const { payload, ...other } = event;
        listener({
            ...other,
            ...payload,
        });
    }, eventType);
}

export function useAny<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListener<UrbanSyntheticEvent<NativeEvent>>,
) {
    useSubscribe(listener, 'any'); // TODO: rewrite to useSubscribeWithSpreadPayload
}

export function useText<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'text'>,
) {
    useSubscribeWithSpreadPayload(listener, 'text');
}

export function useCommand<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'command'>,
) {
    useSubscribeWithSpreadPayload(listener, 'command');
}

export function useSticker<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'sticker'>,
) {
    useSubscribeWithSpreadPayload(listener, 'sticker');
}

export function useAnimation<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'animation'>,
) {
    useSubscribeWithSpreadPayload(listener, 'animation');
}

export function useAudio<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'audio'>,
) {
    useSubscribeWithSpreadPayload(listener, 'audio');
}

export function useContact<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'contact'>,
) {
    useSubscribeWithSpreadPayload(listener, 'contact');
}

export function useFile<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'file'>,
) {
    useSubscribeWithSpreadPayload(listener, 'file');
}

export function useInvoice<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'invoice'>,
) {
    useSubscribeWithSpreadPayload(listener, 'invoice');
}

export function useLocation<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'location'>,
) {
    useSubscribeWithSpreadPayload(listener, 'location');
}

export function useImage<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'image'>,
) {
    useSubscribeWithSpreadPayload(listener, 'image');
}

export function usePoll<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'poll'>,
) {
    useSubscribeWithSpreadPayload(listener, 'poll');
}

export function useVideo<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'video'>,
) {
    useSubscribeWithSpreadPayload(listener, 'video');
}

export function useVoice<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'voice'>,
) {
    useSubscribeWithSpreadPayload(listener, 'voice');
}

export function useDice<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'dice'>,
) {
    useSubscribeWithSpreadPayload(listener, 'dice');
}

export function useAction<NativeEvent extends UrbanNativeEvent>(
    listener: UrbanListenerByTypeWithSpreadPayload<NativeEvent, 'action'>,
) {
    useSubscribeWithSpreadPayload(listener, 'action');
}
