import { UrbanBotType, UrbanChat, UrbanFile, UrbanFrom, UrbanListener } from './index';

export interface UrbanNativeEvent<Type = any, Payload = any> {
    type: Type;
    payload?: Payload;
}

export interface UrbanSyntheticEventCommon<BotType extends UrbanBotType> {
    chat: UrbanChat;
    nativeEvent: BotType['NativeEvent'];
    from: UrbanFrom;
}

export interface UrbanSyntheticEventAction<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'action';
    payload: {
        actionId: string;
    };
}

export interface UrbanSyntheticEventCommand<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'command';
    payload: {
        command: string;
        argument?: string;
    };
}

export interface UrbanSyntheticEventSticker<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'sticker';
    payload: {
        emoji?: string;
        id?: string;
        width?: number;
        height?: number;
        name?: string;
    };
}

export interface UrbanSyntheticEventDice<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'dice';
    payload: {
        value: number;
    };
}

export interface UrbanSyntheticEventText<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'text';
    payload: {
        text: string;
    };
}

export interface UrbanSyntheticEventAnimation<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'animation';
    payload: {
        id?: string;
        duration: number;
        name?: string;
        mimeType?: string;
        text?: string;
    };
}

export interface UrbanSyntheticEventAudio<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'audio';
    payload: {
        files: UrbanFile[];
        text?: string;
    };
}

export interface UrbanSyntheticEventContact<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'contact';
    payload: {
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        userId?: string | number;
    };
}

export interface UrbanSyntheticEventFile<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'file';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventInvoice<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'invoice';
    payload: {
        totalAmount: number;
        title?: string;
        description?: string;
        startParameter?: string;
        currency?: string;
    };
}

export interface UrbanSyntheticEventLocation<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'location';
    payload: {
        latitude: number;
        longitude: number;
    };
}

export interface UrbanSyntheticEventImage<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'image';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventPoll<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'poll';
    payload: {
        id?: string | number;
        question: string;
        options: Array<{ id?: string | number; text: string; count?: number }>;
    };
}

export interface UrbanSyntheticEventVideo<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'video';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventVoice<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'voice';
    payload: {
        id?: string;
        duration?: number;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventVideoNote<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'video_note';
    payload: {
        id?: string;
        duration?: number;
        length?: number;
    };
}

export interface UrbanSyntheticEventAny<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'any';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

export type UrbanSyntheticEvent<BotType extends UrbanBotType> =
    | UrbanSyntheticEventAction<BotType>
    | UrbanSyntheticEventVoice<BotType>
    | UrbanSyntheticEventCommand<BotType>
    | UrbanSyntheticEventInvoice<BotType>
    | UrbanSyntheticEventAnimation<BotType>
    | UrbanSyntheticEventAudio<BotType>
    | UrbanSyntheticEventVideo<BotType>
    | UrbanSyntheticEventText<BotType>
    | UrbanSyntheticEventPoll<BotType>
    | UrbanSyntheticEventImage<BotType>
    | UrbanSyntheticEventFile<BotType>
    | UrbanSyntheticEventContact<BotType>
    | UrbanSyntheticEventSticker<BotType>
    | UrbanSyntheticEventLocation<BotType>
    | UrbanSyntheticEventDice<BotType>
    | UrbanSyntheticEventAny<BotType>
    | UrbanSyntheticEventVideoNote<BotType>;

export type UrbanSyntheticEventByType<
    BotType extends UrbanBotType,
    T extends UrbanSyntheticEvent<BotType>['type']
> = T extends 'text'
    ? UrbanSyntheticEventText<BotType>
    : T extends 'command'
    ? UrbanSyntheticEventCommand<BotType>
    : T extends 'sticker'
    ? UrbanSyntheticEventSticker<BotType>
    : T extends 'animation'
    ? UrbanSyntheticEventAnimation<BotType>
    : T extends 'audio'
    ? UrbanSyntheticEventAudio<BotType>
    : T extends 'contact'
    ? UrbanSyntheticEventContact<BotType>
    : T extends 'file'
    ? UrbanSyntheticEventFile<BotType>
    : T extends 'invoice'
    ? UrbanSyntheticEventInvoice<BotType>
    : T extends 'location'
    ? UrbanSyntheticEventLocation<BotType>
    : T extends 'image'
    ? UrbanSyntheticEventImage<BotType>
    : T extends 'poll'
    ? UrbanSyntheticEventPoll<BotType>
    : T extends 'dice'
    ? UrbanSyntheticEventDice<BotType>
    : T extends 'voice'
    ? UrbanSyntheticEventVoice<BotType>
    : T extends 'action'
    ? UrbanSyntheticEventAction<BotType>
    : T extends 'video'
    ? UrbanSyntheticEventVideo<BotType>
    : T extends 'video_note'
    ? UrbanSyntheticEventVideoNote<BotType>
    : T extends 'any'
    ? UrbanSyntheticEventAny<BotType>
    : UrbanSyntheticEvent<BotType>;

export type UrbanListenerByType<
    BotType extends UrbanBotType,
    T extends UrbanSyntheticEvent<BotType>['type']
> = UrbanListener<UrbanSyntheticEventByType<BotType, T>>;

export type UrbanSyntheticEventType<BotType extends UrbanBotType> = UrbanSyntheticEvent<BotType>['type'];
export type UrbanListenerByNativeEvent<BotType extends UrbanBotType> = UrbanListenerByType<
    BotType,
    UrbanSyntheticEventType<BotType>
>;

export type SpreadField<T, K extends keyof T> = Omit<T, K> & T[K];

export type UrbanListenerByNativeEventWithSpreadPayload<
    BotType extends UrbanBotType,
    Event extends Parameters<UrbanListenerByNativeEvent<BotType>>[0]
> = (event: SpreadField<Event, 'payload'>) => unknown;

export type UrbanEventListener<BotType extends UrbanBotType, Command extends UrbanSyntheticEvent<BotType>['type']> = (
    event: SpreadField<UrbanSyntheticEventByType<BotType, Command>, 'payload'>,
) => unknown;
