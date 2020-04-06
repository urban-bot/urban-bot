import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

function useSubscribe(func, event) {
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        function handler(ctx) {
            const { id } = ctx.from;

            if (id === userId) {
                func(ctx);
            }
        }

        bot.on(event, handler);

        return () => {
            bot.removeListener(event, handler);
        };
    }, [func, bot, userId]);
}

export function useMessage(func) {
    useSubscribe(func, 'message');
}

export function useText(func) {
    useSubscribe(func, 'text');
}

export function useSticker(func) {
    useSubscribe(func, 'sticker');
}

export function useAnimation(func) {
    useSubscribe(func, 'animation');
}

export function useAudio(func) {
    useSubscribe(func, 'audio');
}

export function useContact(func) {
    useSubscribe(func, 'contact');
}

export function useDocument(func) {
    useSubscribe(func, 'document');
}

export function useInvoice(func) {
    useSubscribe(func, 'invoice');
}

export function usePassportData(func) {
    useSubscribe(func, 'passport_data');
}

export function useLocation(func) {
    useSubscribe(func, 'location');
}

export function usePhoto(func) {
    useSubscribe(func, 'photo');
}

export function usePoll(func) {
    useSubscribe(func, 'poll');
}

export function useVideo(func) {
    useSubscribe(func, 'video');
}

export function useVideoNote(func) {
    useSubscribe(func, 'video_note');
}

export function useVoice(func) {
    useSubscribe(func, 'voice');
}
