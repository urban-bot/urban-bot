import React, { Context } from 'react';
import { BotContext, RouterContext } from '../context';
import EventEmitter from 'events';
import { UrbanChat } from '../types/index';

type BotContext = {
    chat: UrbanChat;
    $$managerBot: EventEmitter;
};

type Callback = (props: unknown) => void;

type RouterContext = unknown;

export function useBotContext() {
    return React.useContext<BotContext>((BotContext as unknown) as Context<BotContext>);
}

export function useRouter() {
    return React.useContext<RouterContext>((RouterContext as unknown) as Context<RouterContext>);
}

function useSubscribe(callback: Callback, event: string | symbol) {
    const { chat, $$managerBot } = useBotContext();

    React.useEffect(() => {
        const adapter = ({ payload, ...other }: any) => callback({ ...other, ...payload });
        $$managerBot.on(event, adapter, chat.id);

        return () => {
            $$managerBot.removeListener(event, adapter, chat.id);
        };
    }, [callback, $$managerBot, event, chat]);
}

export function useAny(callback: Callback) {
    useSubscribe(callback, 'any');
}

export function useText(callback: Callback) {
    useSubscribe(callback, 'text');
}

export function useCommand(callback: Callback) {
    useSubscribe(callback, 'command');
}

export function useSticker(callback: Callback) {
    useSubscribe(callback, 'sticker');
}

export function useAnimation(callback: Callback) {
    useSubscribe(callback, 'animation');
}

export function useAudio(callback: Callback) {
    useSubscribe(callback, 'audio');
}

export function useContact(callback: Callback) {
    useSubscribe(callback, 'contact');
}

export function useDocument(callback: Callback) {
    useSubscribe(callback, 'document');
}

export function useInvoice(callback: Callback) {
    useSubscribe(callback, 'invoice');
}

export function useLocation(callback: Callback) {
    useSubscribe(callback, 'location');
}

export function usePhoto(callback: Callback) {
    useSubscribe(callback, 'photo');
}

export function usePoll(callback: Callback) {
    useSubscribe(callback, 'poll');
}

export function useVideo(callback: Callback) {
    useSubscribe(callback, 'video');
}

export function useVoice(callback: Callback) {
    useSubscribe(callback, 'voice');
}

export function useDice(callback: Callback) {
    useSubscribe(callback, 'dice');
}

export function useAction(callback: Callback) {
    useSubscribe(callback, 'action');
}
