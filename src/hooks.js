import React from 'react';
import { BotContext, RouterContext } from './context';
import { getRandomId } from './utils/getRandomId';

export function useBotContext() {
    return React.useContext(BotContext);
}

export function useRouter() {
    return React.useContext(RouterContext);
}

function useSubscribe(callback, event) {
    const { chat, bot } = useBotContext();

    React.useEffect(() => {
        const eventId = getRandomId();
        bot.on(event, callback, eventId, chat.id);

        return () => {
            bot.removeListener(event, callback, eventId);
        };
    }, [callback, bot, event, chat]);
}

export function useMessage(callback) {
    useSubscribe(callback, 'message');
}

export function useText(callback) {
    useSubscribe(callback, 'text');
}

export function useCommand(callback) {
    useSubscribe(callback, 'command');
}

export function useSticker(callback) {
    useSubscribe(callback, 'sticker');
}

export function useAnimation(callback) {
    useSubscribe(callback, 'animation');
}

export function useAudio(callback) {
    useSubscribe(callback, 'audio');
}

export function useContact(callback) {
    useSubscribe(callback, 'contact');
}

export function useDocument(callback) {
    useSubscribe(callback, 'document');
}

export function useInvoice(callback) {
    useSubscribe(callback, 'invoice');
}

export function usePassportData(callback) {
    useSubscribe(callback, 'passport_data');
}

export function useLocation(callback) {
    useSubscribe(callback, 'location');
}

export function usePhoto(callback) {
    useSubscribe(callback, 'photo');
}

export function usePoll(callback) {
    useSubscribe(callback, 'poll');
}

export function useVideo(callback) {
    useSubscribe(callback, 'video');
}

export function useVideoNote(callback) {
    useSubscribe(callback, 'video_note');
}

export function useVoice(callback) {
    useSubscribe(callback, 'voice');
}

export function useDice(callback) {
    useMessage((ctx) => {
        if (ctx.dice !== undefined) {
            callback(ctx);
        }
    });
}

export function useAction(callback) {
    useSubscribe(callback, 'action');
}
