import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import { UrbanEvent, UrbanEventText } from '../types/Events';

export function useBotContext<Type, NativeEventPayload, Meta>() {
    const BotContext = getBotContext<Type, NativeEventPayload, Meta>();
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
    Meta,
    Event extends UrbanEvent<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>
>(callback: UrbanListener<Event>, event: Event['type'] | 'any') {
    const { chat, $$managerBot } = useBotContext<Type, NativeEventPayload, Meta>();

    React.useEffect(() => {
        $$managerBot.on(event, callback, chat.id);

        return () => {
            $$managerBot.removeListener(event, callback, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useAny<Type, NativeEventPayload, Meta>(callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'any');
}

export function useText<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventText<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventText<Type, NativeEventPayload>>(callback, 'text');
}

export function useCommand<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'command');
}

export function useSticker<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'sticker');
}

export function useAnimation<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'animation');
}

export function useAudio<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'audio');
}

export function useContact<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'contact');
}

export function useDocument<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'document');
}

export function useInvoice<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'invoice');
}

export function useLocation<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'location');
}

export function usePhoto<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'photo');
}

export function usePoll<Type, NativeEventPayload, Meta>(callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'poll');
}

export function useVideo<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'video');
}

export function useVoice<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'voice');
}

export function useDice<Type, NativeEventPayload, Meta>(callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'dice');
}

export function useAction<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEvent<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'action');
}
