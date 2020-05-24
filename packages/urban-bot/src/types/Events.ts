import { UrbanBot, UrbanChat, UrbanFile, UrbanFrom, UrbanListener } from './index';
import { BotMetaByBot } from '../hooks/hooks';

export interface UrbanNativeEvent<Type = any, Payload = any> {
    type: Type;
    payload?: Payload;
}

export interface UrbanSyntheticEventCommon<Bot extends UrbanBot> {
    chat: UrbanChat;
    nativeEvent?: BotMetaByBot<Bot>['NativeEvent'];
    from: UrbanFrom;
}

export interface UrbanSyntheticEventAction<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'action';
    payload: {
        actionId: string;
    };
}

export interface UrbanSyntheticEventCommand<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'command';
    payload: {
        command: string;
        text?: string;
    };
}

export interface UrbanSyntheticEventSticker<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'sticker';
    payload: {
        emoji?: string;
        id?: string;
        width?: number;
        height?: number;
        name?: string;
        size?: number;
    };
}

export interface UrbanSyntheticEventDice<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'dice';
    payload: {
        value: number;
    };
}

export interface UrbanSyntheticEventText<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'text';
    payload: {
        text: string;
    };
}

export interface UrbanSyntheticEventAnimation<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'animation';
    payload: {
        duration: number;
        fileName?: string;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventAudio<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'audio';
    payload: {
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventContact<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'contact';
    payload: {
        phoneNumber: string;
        firstName: string;
        lastName?: string;
        userId?: number;
    };
}

export interface UrbanSyntheticEventFile<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'file';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventInvoice<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'invoice';
    payload: {
        title: string;
        description: string;
        startParameter: string;
        currency: string;
        totalAmount: number;
    };
}

export interface UrbanSyntheticEventLocation<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'location';
    payload: {
        latitude: number;
        longitude: number;
    };
}

export interface UrbanSyntheticEventImage<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'image';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventPoll<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'poll';
    payload: {
        id: string;
        question: string;
        options: Array<{ id?: string; text: string; count?: number }>;
    };
}

export interface UrbanSyntheticEventVideo<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'video';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventVoice<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'voice';
    payload: {
        duration: number;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventAny<Bot extends UrbanBot> extends UrbanSyntheticEventCommon<Bot> {
    type: 'any';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

export type UrbanSyntheticEvent<Bot extends UrbanBot> =
    | UrbanSyntheticEventAction<Bot>
    | UrbanSyntheticEventVoice<Bot>
    | UrbanSyntheticEventCommand<Bot>
    | UrbanSyntheticEventInvoice<Bot>
    | UrbanSyntheticEventAnimation<Bot>
    | UrbanSyntheticEventAudio<Bot>
    | UrbanSyntheticEventVideo<Bot>
    | UrbanSyntheticEventText<Bot>
    | UrbanSyntheticEventPoll<Bot>
    | UrbanSyntheticEventImage<Bot>
    | UrbanSyntheticEventFile<Bot>
    | UrbanSyntheticEventContact<Bot>
    | UrbanSyntheticEventSticker<Bot>
    | UrbanSyntheticEventLocation<Bot>
    | UrbanSyntheticEventDice<Bot>
    | UrbanSyntheticEventAny<Bot>;

export type UrbanSyntheticEventByType<
    Bot extends UrbanBot,
    T extends UrbanSyntheticEvent<Bot>['type']
> = T extends 'text'
    ? UrbanSyntheticEventText<Bot>
    : T extends 'command'
    ? UrbanSyntheticEventCommand<Bot>
    : T extends 'pool'
    ? UrbanSyntheticEventPoll<Bot>
    : T extends 'sticker'
    ? UrbanSyntheticEventSticker<Bot>
    : T extends 'animation'
    ? UrbanSyntheticEventAnimation<Bot>
    : T extends 'audio'
    ? UrbanSyntheticEventAudio<Bot>
    : T extends 'contact'
    ? UrbanSyntheticEventContact<Bot>
    : T extends 'file'
    ? UrbanSyntheticEventFile<Bot>
    : T extends 'invoice'
    ? UrbanSyntheticEventInvoice<Bot>
    : T extends 'location'
    ? UrbanSyntheticEventLocation<Bot>
    : T extends 'image'
    ? UrbanSyntheticEventImage<Bot>
    : T extends 'poll'
    ? UrbanSyntheticEventPoll<Bot>
    : T extends 'dice'
    ? UrbanSyntheticEventDice<Bot>
    : T extends 'voice'
    ? UrbanSyntheticEventVoice<Bot>
    : T extends 'action'
    ? UrbanSyntheticEventAction<Bot>
    : T extends 'video'
    ? UrbanSyntheticEventVideo<Bot>
    : T extends 'any'
    ? UrbanSyntheticEventAny<Bot>
    : UrbanSyntheticEvent<Bot>;

export type UrbanListenerByType<Bot extends UrbanBot, T extends UrbanSyntheticEvent<Bot>['type']> = UrbanListener<
    UrbanSyntheticEventByType<Bot, T>
>;

export type UrbanSyntheticEventType<Bot extends UrbanBot> = UrbanSyntheticEvent<Bot>['type'];
export type UrbanListenerByNativeEvent<Bot extends UrbanBot> = UrbanListenerByType<Bot, UrbanSyntheticEventType<Bot>>;

export type SpreadField<T, K extends keyof T> = Omit<T, K> & T[K];

export type UrbanListenerByNativeEventWithSpreadPayload<
    Bot extends UrbanBot,
    Event extends Parameters<UrbanListenerByNativeEvent<Bot>>[0]
> = (event: SpreadField<Event, 'payload'>) => unknown;

export type UrbanEventListener<Bot extends UrbanBot, Command extends UrbanSyntheticEvent<Bot>['type']> = (
    event: SpreadField<UrbanSyntheticEventByType<Bot, Command>, 'payload'>,
) => unknown;
