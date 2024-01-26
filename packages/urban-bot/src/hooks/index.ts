import { useSubscribeWithSpreadPayload } from './useSubscribeWithSpreadPayload';
import type { UrbanEventListener, UrbanBotType } from '../types';

export function useAnyEvent<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'any'>) {
    useSubscribeWithSpreadPayload(listener, 'any');
}
export function useSticker<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'sticker'>) {
    useSubscribeWithSpreadPayload(listener, 'sticker');
}

export function useAnimation<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'animation'>) {
    useSubscribeWithSpreadPayload(listener, 'animation');
}

export function useAudio<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'audio'>) {
    useSubscribeWithSpreadPayload(listener, 'audio');
}

export function useContact<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'contact'>) {
    useSubscribeWithSpreadPayload(listener, 'contact');
}

export function useFile<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'file'>) {
    useSubscribeWithSpreadPayload(listener, 'file');
}

export function useInvoice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'invoice'>) {
    useSubscribeWithSpreadPayload(listener, 'invoice');
}

export function useLocation<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'location'>) {
    useSubscribeWithSpreadPayload(listener, 'location');
}

export function useImage<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'image'>) {
    useSubscribeWithSpreadPayload(listener, 'image');
}

export function usePoll<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'poll'>) {
    useSubscribeWithSpreadPayload(listener, 'poll');
}

export function useVideo<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'video'>) {
    useSubscribeWithSpreadPayload(listener, 'video');
}

export function useVoice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'voice'>) {
    useSubscribeWithSpreadPayload(listener, 'voice');
}

export function useVideoNote<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'video_note'>) {
    useSubscribeWithSpreadPayload(listener, 'video_note');
}

export function useMediaGroup<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'media_group'>) {
    useSubscribeWithSpreadPayload(listener, 'media_group');
}

export function useDice<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'dice'>) {
    useSubscribeWithSpreadPayload(listener, 'dice');
}

export function useAction<BotType extends UrbanBotType>(listener: UrbanEventListener<BotType, 'action'>) {
    useSubscribeWithSpreadPayload(listener, 'action');
}
