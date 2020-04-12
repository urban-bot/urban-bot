import React from 'react';
import { BotContext, RouterContext } from './context';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

function useSubscribe(func, event) {
    const { chat, bot } = useBotContext();

    React.useEffect(() => {
        bot.on(event, func, chat.id);

        return () => {
            bot.removeListener(event, func);
        };
    }, [func, bot, event, chat]);
}

export function useMessage(func) {
    useSubscribe(func, 'message');
}

export function useText(func) {
    useSubscribe((ctx) => {
        const { text } = ctx;
        if (text[0] === '/') {
            return;
        }

        func(ctx);
    }, 'text');
}

export function useCommand(func) {
    useSubscribe((ctx) => {
        const { text } = ctx;
        if (text[0] !== '/') {
            return;
        }

        func(ctx);
    }, 'text');
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

export function useDice(func) {
    useMessage((ctx) => {
        if (ctx.dice !== undefined) {
            func(ctx);
        }
    });
}
