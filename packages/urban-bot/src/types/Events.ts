import { UrbanBotMeta, UrbanChat, UrbanFile, UrbanFrom, UrbanListener } from './index';

export interface UrbanNativeEvent<Type = any, Payload = any> {
    type: Type;
    payload?: Payload;
}

export interface UrbanSyntheticEventCommon<Metadata extends UrbanBotMeta> {
    chat: UrbanChat;
    nativeEvent: Metadata['NativeEvent'];
    from: UrbanFrom;
}

export interface UrbanSyntheticEventAction<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'action';
    payload: {
        actionId: string;
    };
}

export interface UrbanSyntheticEventCommand<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'command';
    payload: {
        command: string;
        text?: string;
    };
}

export interface UrbanSyntheticEventSticker<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
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

export interface UrbanSyntheticEventDice<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'dice';
    payload: {
        value: number;
    };
}

export interface UrbanSyntheticEventText<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'text';
    payload: {
        text: string;
    };
}

export interface UrbanSyntheticEventAnimation<Metadata extends UrbanBotMeta>
    extends UrbanSyntheticEventCommon<Metadata> {
    type: 'animation';
    payload: {
        duration: number;
        fileName?: string;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventAudio<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'audio';
    payload: {
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventContact<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'contact';
    payload: {
        phoneNumber: string;
        firstName: string;
        lastName?: string;
        userId?: number;
    };
}

export interface UrbanSyntheticEventFile<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'file';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventInvoice<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'invoice';
    payload: {
        title: string;
        description: string;
        startParameter: string;
        currency: string;
        totalAmount: number;
    };
}

export interface UrbanSyntheticEventLocation<Metadata extends UrbanBotMeta>
    extends UrbanSyntheticEventCommon<Metadata> {
    type: 'location';
    payload: {
        latitude: number;
        longitude: number;
    };
}

export interface UrbanSyntheticEventImage<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'image';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventPoll<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'poll';
    payload: {
        id: string;
        question: string;
        options: Array<{ id?: string; text: string; count?: number }>;
    };
}

export interface UrbanSyntheticEventVideo<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'video';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventVoice<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'voice';
    payload: {
        duration: number;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventAny<Metadata extends UrbanBotMeta> extends UrbanSyntheticEventCommon<Metadata> {
    type: 'any';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

export type UrbanSyntheticEvent<Metadata extends UrbanBotMeta> =
    | UrbanSyntheticEventAction<Metadata>
    | UrbanSyntheticEventVoice<Metadata>
    | UrbanSyntheticEventCommand<Metadata>
    | UrbanSyntheticEventInvoice<Metadata>
    | UrbanSyntheticEventAnimation<Metadata>
    | UrbanSyntheticEventAudio<Metadata>
    | UrbanSyntheticEventVideo<Metadata>
    | UrbanSyntheticEventText<Metadata>
    | UrbanSyntheticEventPoll<Metadata>
    | UrbanSyntheticEventImage<Metadata>
    | UrbanSyntheticEventFile<Metadata>
    | UrbanSyntheticEventContact<Metadata>
    | UrbanSyntheticEventSticker<Metadata>
    | UrbanSyntheticEventLocation<Metadata>
    | UrbanSyntheticEventDice<Metadata>
    | UrbanSyntheticEventAny<Metadata>;

export type UrbanSyntheticEventByType<
    Metadata extends UrbanBotMeta,
    T extends UrbanSyntheticEvent<Metadata>['type']
> = T extends 'text'
    ? UrbanSyntheticEventText<Metadata>
    : T extends 'command'
    ? UrbanSyntheticEventCommand<Metadata>
    : T extends 'pool'
    ? UrbanSyntheticEventPoll<Metadata>
    : T extends 'sticker'
    ? UrbanSyntheticEventSticker<Metadata>
    : T extends 'animation'
    ? UrbanSyntheticEventAnimation<Metadata>
    : T extends 'audio'
    ? UrbanSyntheticEventAudio<Metadata>
    : T extends 'contact'
    ? UrbanSyntheticEventContact<Metadata>
    : T extends 'file'
    ? UrbanSyntheticEventFile<Metadata>
    : T extends 'invoice'
    ? UrbanSyntheticEventInvoice<Metadata>
    : T extends 'location'
    ? UrbanSyntheticEventLocation<Metadata>
    : T extends 'image'
    ? UrbanSyntheticEventImage<Metadata>
    : T extends 'poll'
    ? UrbanSyntheticEventPoll<Metadata>
    : T extends 'dice'
    ? UrbanSyntheticEventDice<Metadata>
    : T extends 'voice'
    ? UrbanSyntheticEventVoice<Metadata>
    : T extends 'action'
    ? UrbanSyntheticEventAction<Metadata>
    : T extends 'video'
    ? UrbanSyntheticEventVideo<Metadata>
    : T extends 'any'
    ? UrbanSyntheticEventAny<Metadata>
    : UrbanSyntheticEvent<Metadata>;

export type UrbanListenerByType<
    Metadata extends UrbanBotMeta,
    T extends UrbanSyntheticEvent<Metadata>['type']
> = UrbanListener<UrbanSyntheticEventByType<Metadata, T>>;

export type UrbanSyntheticEventType<Metadata extends UrbanBotMeta> = UrbanSyntheticEvent<Metadata>['type'];
export type UrbanListenerByNativeEvent<Metadata extends UrbanBotMeta> = UrbanListenerByType<
    Metadata,
    UrbanSyntheticEventType<Metadata>
>;

export type SpreadField<T, K extends keyof T> = Omit<T, K> & T[K];

export type UrbanListenerByNativeEventWithSpreadPayload<
    Metadata extends UrbanBotMeta,
    Event extends Parameters<UrbanListenerByNativeEvent<Metadata>>[0]
> = (event: SpreadField<Event, 'payload'>) => unknown;

export type UrbanEventListener<Metadata extends UrbanBotMeta, Command extends UrbanSyntheticEvent<Metadata>['type']> = (
    event: SpreadField<UrbanSyntheticEventByType<Metadata, Command>, 'payload'>,
) => unknown;
