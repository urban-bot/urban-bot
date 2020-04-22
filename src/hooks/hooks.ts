import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import { UrbanEvent, UrbanListenerByType } from '../types/Events';

export function useBotContext<Type, NativeEventPayload, MessageMeta>() {
    const BotContext = getBotContext<Type, NativeEventPayload, MessageMeta>();
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
    Type,
    NativeEventPayload,
    Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>,
    MessageMeta = unknown
>(callback: UrbanListener<Event>, event: Event['type'] | 'any') {
    const { chat, $$managerBot } = useBotContext<Type, NativeEventPayload, MessageMeta>();

    React.useEffect(() => {
        $$managerBot.on(event, callback, chat.id);

        return () => {
            $$managerBot.removeListener(event, callback, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useAny<Type, NativeEventPayload>(callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>) {
    useSubscribe(callback, 'any');
}

export function useText<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'text'>) {
    useSubscribe(callback, 'text');
}

export function useCommand<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'command'>,
) {
    useSubscribe(callback, 'command');
}

export function useSticker<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'sticker'>,
) {
    useSubscribe(callback, 'sticker');
}

export function useAnimation<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'animation'>,
) {
    useSubscribe(callback, 'animation');
}

export function useAudio<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'audio'>) {
    useSubscribe(callback, 'audio');
}

export function useContact<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'contact'>,
) {
    useSubscribe(callback, 'contact');
}

export function useDocument<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'document'>,
) {
    useSubscribe(callback, 'document');
}

export function useInvoice<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'invoice'>,
) {
    useSubscribe(callback, 'invoice');
}

export function useLocation<Type, NativeEventPayload>(
    callback: UrbanListenerByType<Type, NativeEventPayload, 'location'>,
) {
    useSubscribe(callback, 'location');
}

export function useImage<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'image'>) {
    useSubscribe(callback, 'image');
}

export function usePoll<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'poll'>) {
    useSubscribe(callback, 'poll');
}

export function useVideo<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'video'>) {
    useSubscribe(callback, 'video');
}

export function useVoice<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'voice'>) {
    useSubscribe(callback, 'voice');
}

export function useDice<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'dice'>) {
    useSubscribe(callback, 'dice');
}

export function useAction<Type, NativeEventPayload>(callback: UrbanListenerByType<Type, NativeEventPayload, 'action'>) {
    useSubscribe(callback, 'action');
}
