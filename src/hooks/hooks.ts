import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import {
    UrbanSyntheticEvent,
    UrbanListenerByType,
    UrbanNativeEvent,
    UrbanSyntheticEventType,
    SpreadCallback,
    SpreadUrbanListenerByType,
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
>(callback: UrbanListener<Event>, event: Event['type'] | 'any') {
    const { chat, $$managerBot } = useBotContext<Bot>();

    React.useEffect(() => {
        $$managerBot.on(event, callback, chat.id);

        return () => {
            $$managerBot.removeListener(event, callback, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useSubscribeWithSpreadPayload<
    NativeEvent extends UrbanNativeEvent,
    EventType extends UrbanSyntheticEventType<NativeEvent>,
    Event extends Parameters<UrbanListenerByType<NativeEvent, EventType>>[0]
>(callback: SpreadCallback<NativeEvent, Event>, eventType: EventType) {
    useSubscribe<UrbanBotType, Event>((event) => {
        const { payload, ...other } = event;
        callback({
            ...other,
            ...payload,
        });
    }, eventType);
}

export function useAny<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListener<UrbanSyntheticEvent<NativeEvent>>,
) {
    useSubscribe(callback, 'any'); // TODO: rewrite to useSubscribeWithSpreadPayload
}

export function useText<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'text'>,
) {
    useSubscribeWithSpreadPayload(callback, 'text');
}

export function useCommand<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'command'>,
) {
    useSubscribeWithSpreadPayload(callback, 'command');
}

export function useSticker<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'sticker'>,
) {
    useSubscribeWithSpreadPayload(callback, 'sticker');
}

export function useAnimation<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'animation'>,
) {
    useSubscribeWithSpreadPayload(callback, 'animation');
}

export function useAudio<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'audio'>,
) {
    useSubscribeWithSpreadPayload(callback, 'audio');
}

export function useContact<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'contact'>,
) {
    useSubscribeWithSpreadPayload(callback, 'contact');
}

export function useFile<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'file'>,
) {
    useSubscribeWithSpreadPayload(callback, 'file');
}

export function useInvoice<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'invoice'>,
) {
    useSubscribeWithSpreadPayload(callback, 'invoice');
}

export function useLocation<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'location'>,
) {
    useSubscribeWithSpreadPayload(callback, 'location');
}

export function useImage<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'image'>,
) {
    useSubscribeWithSpreadPayload(callback, 'image');
}

export function usePoll<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'poll'>,
) {
    useSubscribeWithSpreadPayload(callback, 'poll');
}

export function useVideo<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'video'>,
) {
    useSubscribeWithSpreadPayload(callback, 'video');
}

export function useVoice<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'voice'>,
) {
    useSubscribeWithSpreadPayload(callback, 'voice');
}

export function useDice<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'dice'>,
) {
    useSubscribeWithSpreadPayload(callback, 'dice');
}

export function useAction<NativeEvent extends UrbanNativeEvent>(
    callback: SpreadUrbanListenerByType<NativeEvent, 'action'>,
) {
    useSubscribeWithSpreadPayload(callback, 'action');
}
