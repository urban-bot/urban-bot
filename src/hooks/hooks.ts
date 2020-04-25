import React from 'react';
import { getBotContext, RouterContext } from '../context';
import { UrbanListener } from '../types';
import { UrbanSyntheticEvent, UrbanListenerByType, UrbanNativeEvent } from '../types/Events';

export function useBotContext<NativeEvent extends UrbanNativeEvent, MessageMeta>() {
    const BotContext = getBotContext<NativeEvent, MessageMeta>();
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
    NativeEvent extends UrbanNativeEvent,
    Event extends UrbanSyntheticEvent<NativeEvent> = UrbanSyntheticEvent<NativeEvent>,
    MessageMeta = unknown
>(callback: UrbanListener<Event>, event: Event['type'] | 'any') {
    const { chat, $$managerBot } = useBotContext<NativeEvent, MessageMeta>();

    React.useEffect(() => {
        $$managerBot.on(event, callback, chat.id);

        return () => {
            $$managerBot.removeListener(event, callback, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useAny<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListener<UrbanSyntheticEvent<NativeEvent>>,
) {
    useSubscribe(callback, 'any');
}

export function useText<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'text'>) {
    useSubscribe(callback, 'text');
}

export function useCommand<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'command'>,
) {
    useSubscribe(callback, 'command');
}

export function useSticker<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'sticker'>,
) {
    useSubscribe(callback, 'sticker');
}

export function useAnimation<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'animation'>,
) {
    useSubscribe(callback, 'animation');
}

export function useAudio<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'audio'>) {
    useSubscribe(callback, 'audio');
}

export function useContact<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'contact'>,
) {
    useSubscribe(callback, 'contact');
}

export function useFile<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'file'>) {
    useSubscribe(callback, 'file');
}

export function useInvoice<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'invoice'>,
) {
    useSubscribe(callback, 'invoice');
}

export function useLocation<NativeEvent extends UrbanNativeEvent>(
    callback: UrbanListenerByType<NativeEvent, 'location'>,
) {
    useSubscribe(callback, 'location');
}

export function useImage<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'image'>) {
    useSubscribe(callback, 'image');
}

export function usePoll<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'poll'>) {
    useSubscribe(callback, 'poll');
}

export function useVideo<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'video'>) {
    useSubscribe(callback, 'video');
}

export function useVoice<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'voice'>) {
    useSubscribe(callback, 'voice');
}

export function useDice<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'dice'>) {
    useSubscribe(callback, 'dice');
}

export function useAction<NativeEvent extends UrbanNativeEvent>(callback: UrbanListenerByType<NativeEvent, 'action'>) {
    useSubscribe(callback, 'action');
}
