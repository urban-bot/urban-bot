import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import {
    UrbanEvent,
    UrbanEventAction,
    UrbanEventAnimation,
    UrbanEventAudio,
    UrbanEventCommand,
    UrbanEventContact,
    UrbanEventDice,
    UrbanEventDocument,
    UrbanEventInvoice,
    UrbanEventLocation,
    UrbanEventImage,
    UrbanEventPoll,
    UrbanEventSticker,
    UrbanEventText,
    UrbanEventVideo,
    UrbanEventVoice,
} from '../types/Events';

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
    callback: UrbanListener<UrbanEventCommand<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventCommand<Type, NativeEventPayload>>(callback, 'command');
}

export function useSticker<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventSticker<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventSticker<Type, NativeEventPayload>>(callback, 'sticker');
}

export function useAnimation<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventAnimation<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventAnimation<Type, NativeEventPayload>>(callback, 'animation');
}

export function useAudio<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventAudio<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventAudio<Type, NativeEventPayload>>(callback, 'audio');
}

export function useContact<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventContact<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventContact<Type, NativeEventPayload>>(callback, 'contact');
}

export function useDocument<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventDocument<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventDocument<Type, NativeEventPayload>>(callback, 'document');
}

export function useInvoice<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventInvoice<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventInvoice<Type, NativeEventPayload>>(callback, 'invoice');
}

export function useLocation<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventLocation<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventLocation<Type, NativeEventPayload>>(callback, 'location');
}

export function useImage<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventImage<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventImage<Type, NativeEventPayload>>(callback, 'image');
}

export function usePoll<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventPoll<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventPoll<Type, NativeEventPayload>>(callback, 'poll');
}

export function useVideo<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventVideo<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventVideo<Type, NativeEventPayload>>(callback, 'video');
}

export function useVoice<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventVoice<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventVoice<Type, NativeEventPayload>>(callback, 'voice');
}

export function useDice<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventDice<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventDice<Type, NativeEventPayload>>(callback, 'dice');
}

export function useAction<Type, NativeEventPayload, Meta>(
    callback: UrbanListener<UrbanEventAction<Type, NativeEventPayload>>,
) {
    useSubscribe<Type, NativeEventPayload, Meta, UrbanEventAction<Type, NativeEventPayload>>(callback, 'action');
}
