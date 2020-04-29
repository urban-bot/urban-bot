import { UrbanChat, UrbanFile, UrbanFrom, UrbanListener } from './index';

export interface UrbanNativeEvent<Type = string, Payload = unknown> {
    type: Type;
    payload?: Payload;
}

export interface UrbanSyntheticEventCommon<NativeEvent extends UrbanNativeEvent> {
    chat: UrbanChat;
    nativeEvent?: NativeEvent;
    from: UrbanFrom;
}

export interface UrbanSyntheticEventAction<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'action';
    payload: {
        actionId: string;
    };
}

export interface UrbanSyntheticEventCommand<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'command';
    payload: {
        command: string;
        text?: string;
    };
}

export interface UrbanSyntheticEventSticker<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
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

export interface UrbanSyntheticEventDice<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'dice';
    payload: {
        value: number;
    };
}

export interface UrbanSyntheticEventText<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'text';
    payload: {
        text: string;
    };
}

export interface UrbanSyntheticEventAnimation<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'animation';
    payload: {
        duration: number;
        fileName?: string;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventAudio<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'audio';
    payload: {
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventContact<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'contact';
    payload: {
        phoneNumber: string;
        firstName: string;
        lastName?: string;
        userId?: number;
    };
}

export interface UrbanSyntheticEventFile<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'file';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventInvoice<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'invoice';
    payload: {
        title: string;
        description: string;
        startParameter: string;
        currency: string;
        totalAmount: number;
    };
}

export interface UrbanSyntheticEventLocation<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'location';
    payload: {
        latitude: number;
        longitude: number;
    };
}

export interface UrbanSyntheticEventImage<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'image';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventPoll<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'poll';
    payload: {
        id: string;
        question: string;
        options: Array<{ id?: string; text: string; count?: number }>;
    };
}

export interface UrbanSyntheticEventVideo<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'video';
    payload: {
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventVoice<NativeEvent extends UrbanNativeEvent>
    extends UrbanSyntheticEventCommon<NativeEvent> {
    type: 'voice';
    payload: {
        duration: number;
    };
}

export type UrbanSyntheticEvent<NativeEvent extends UrbanNativeEvent> =
    | UrbanSyntheticEventAction<NativeEvent>
    | UrbanSyntheticEventVoice<NativeEvent>
    | UrbanSyntheticEventCommand<NativeEvent>
    | UrbanSyntheticEventInvoice<NativeEvent>
    | UrbanSyntheticEventAnimation<NativeEvent>
    | UrbanSyntheticEventAudio<NativeEvent>
    | UrbanSyntheticEventVideo<NativeEvent>
    | UrbanSyntheticEventText<NativeEvent>
    | UrbanSyntheticEventPoll<NativeEvent>
    | UrbanSyntheticEventImage<NativeEvent>
    | UrbanSyntheticEventFile<NativeEvent>
    | UrbanSyntheticEventContact<NativeEvent>
    | UrbanSyntheticEventSticker<NativeEvent>
    | UrbanSyntheticEventLocation<NativeEvent>
    | UrbanSyntheticEventDice<NativeEvent>;

export type UrbanSyntheticEventByType<
    NativeEvent extends UrbanNativeEvent,
    T extends UrbanSyntheticEvent<NativeEvent>['type']
> = T extends 'text'
    ? UrbanSyntheticEventText<NativeEvent>
    : T extends 'command'
    ? UrbanSyntheticEventCommand<NativeEvent>
    : T extends 'pool'
    ? UrbanSyntheticEventPoll<NativeEvent>
    : T extends 'sticker'
    ? UrbanSyntheticEventSticker<NativeEvent>
    : T extends 'animation'
    ? UrbanSyntheticEventAnimation<NativeEvent>
    : T extends 'audio'
    ? UrbanSyntheticEventAudio<NativeEvent>
    : T extends 'contact'
    ? UrbanSyntheticEventContact<NativeEvent>
    : T extends 'file'
    ? UrbanSyntheticEventFile<NativeEvent>
    : T extends 'invoice'
    ? UrbanSyntheticEventInvoice<NativeEvent>
    : T extends 'location'
    ? UrbanSyntheticEventLocation<NativeEvent>
    : T extends 'image'
    ? UrbanSyntheticEventImage<NativeEvent>
    : T extends 'poll'
    ? UrbanSyntheticEventPoll<NativeEvent>
    : T extends 'dice'
    ? UrbanSyntheticEventDice<NativeEvent>
    : T extends 'voice'
    ? UrbanSyntheticEventVoice<NativeEvent>
    : T extends 'action'
    ? UrbanSyntheticEventAction<NativeEvent>
    : T extends 'video'
    ? UrbanSyntheticEventVideo<NativeEvent>
    : UrbanSyntheticEvent<NativeEvent>;

export type UrbanListenerByType<
    NativeEvent extends UrbanNativeEvent,
    T extends UrbanSyntheticEvent<NativeEvent>['type']
> = UrbanListener<UrbanSyntheticEventByType<NativeEvent, T>>;

export type UrbanSyntheticEventType<NativeEvent extends UrbanNativeEvent> = UrbanSyntheticEvent<NativeEvent>['type'];
export type UrbanListenerByNativeEvent<NativeEvent extends UrbanNativeEvent> = UrbanListenerByType<
    NativeEvent,
    UrbanSyntheticEventType<NativeEvent>
>;

export type SpreadField<T, K extends keyof T> = Omit<T, K> & T[K];

export type UrbanListenerByNativeEventWithSpreadPayload<
    NativeEvent extends UrbanNativeEvent,
    Event extends Parameters<UrbanListenerByNativeEvent<NativeEvent>>[0]
> = (event: SpreadField<Event, 'payload'>) => unknown;

export type UrbanListenerByTypeWithSpreadPayload<
    NativeEvent extends UrbanNativeEvent,
    EventType extends UrbanSyntheticEvent<NativeEvent>['type']
> = UrbanListenerByNativeEventWithSpreadPayload<NativeEvent, UrbanSyntheticEventByType<NativeEvent, EventType>>;
