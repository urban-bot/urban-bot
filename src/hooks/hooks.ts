import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { AnyFunction } from '../types/common';

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

function useSubscribe<Type, NativeEventPayload, Meta>(callback: AnyFunction, event: string) {
    const { chat, $$managerBot } = useBotContext<Type, NativeEventPayload, Meta>();

    React.useEffect(() => {
        const adapter = ({ payload, ...other }: any) => callback({ ...other, ...payload });
        $$managerBot.on(event, adapter, chat.id);

        return () => {
            $$managerBot.removeListener(event, adapter, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useAny<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'any');
}

export function useText<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'text');
}

export function useCommand<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'command');
}

export function useSticker<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'sticker');
}

export function useAnimation<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'animation');
}

export function useAudio<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'audio');
}

export function useContact<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'contact');
}

export function useDocument<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'document');
}

export function useInvoice<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'invoice');
}

export function useLocation<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'location');
}

export function usePhoto<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'photo');
}

export function usePoll<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'poll');
}

export function useVideo<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'video');
}

export function useVoice<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'voice');
}

export function useDice<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'dice');
}

export function useAction<Type, NativeEventPayload, Meta>(callback: AnyFunction) {
    useSubscribe<Type, NativeEventPayload, Meta>(callback, 'action');
}
