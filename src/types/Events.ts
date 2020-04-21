import { UrbanChat, UrbanFrom, UrbanListener } from './index';

export type UrbanEventCommon<Type, NativeEventPayload> = {
    chat: UrbanChat;
    nativeEvent?: NativeEvent<Type, NativeEventPayload>;
    from?: UrbanFrom;
};

export type NativeEvent<Type, NativeEventPayload> = {
    type: Type;
    payload?: NativeEventPayload;
};

export type UrbanEventAction<Type, NativeEventPayload> = {
    type: 'action';
    payload: {
        actionId: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventCommand<Type, NativeEventPayload> = {
    type: 'command';
    payload: {
        command: string;
        text?: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventSticker<Type, NativeEventPayload> = {
    type: 'sticker';
    payload: {
        emoji?: string;
        id?: string;
        width?: number;
        height?: number;
        name?: string;
        size?: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventDice<Type, NativeEventPayload> = {
    type: 'dice';
    payload: {
        value: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventText<Type, NativeEventPayload> = {
    type: 'text';
    payload: {
        text: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventAnimation<Type, NativeEventPayload> = {
    type: 'animation';
    payload: {
        duration: number;
        fileName?: string;
        mimeType?: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventAudio<Type, NativeEventPayload> = {
    type: 'audio';
    payload: {
        duration: number;
        performer?: string;
        title?: string;
        mimeType?: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventContact<Type, NativeEventPayload> = {
    type: 'contact';
    payload: {
        phoneNumber: string;
        firstName: string;
        lastName?: string;
        userId?: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventDocument<Type, NativeEventPayload> = {
    type: 'document';
    payload: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventInvoice<Type, NativeEventPayload> = {
    type: 'invoice';
    payload: {
        title: string;
        description: string;
        startParameter: string;
        currency: string;
        totalAmount: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventLocation<Type, NativeEventPayload> = {
    type: 'location';
    payload: {
        latitude: number;
        longitude: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventImage<Type, NativeEventPayload> = {
    type: 'image';
    payload: {
        fileIds: string[];
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventPoll<Type, NativeEventPayload> = {
    type: 'poll';
    payload: {
        id: string;
        question: string;
        options: Array<{ id?: string; text: string; count?: number }>;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventVideo<Type, NativeEventPayload> = {
    type: 'video';
    payload: {
        duration: number;
        fileId: string;
        fileSize?: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEventVoice<Type, NativeEventPayload> = {
    type: 'voice';
    payload: {
        duration: number;
    };
} & UrbanEventCommon<Type, NativeEventPayload>;

export type UrbanEvent<Type, NativeEventPayload> =
    | UrbanEventAction<Type, NativeEventPayload>
    | UrbanEventVoice<Type, NativeEventPayload>
    | UrbanEventCommand<Type, NativeEventPayload>
    | UrbanEventInvoice<Type, NativeEventPayload>
    | UrbanEventAnimation<Type, NativeEventPayload>
    | UrbanEventAudio<Type, NativeEventPayload>
    | UrbanEventVideo<Type, NativeEventPayload>
    | UrbanEventText<Type, NativeEventPayload>
    | UrbanEventPoll<Type, NativeEventPayload>
    | UrbanEventImage<Type, NativeEventPayload>
    | UrbanEventDocument<Type, NativeEventPayload>
    | UrbanEventContact<Type, NativeEventPayload>
    | UrbanEventSticker<Type, NativeEventPayload>
    | UrbanEventLocation<Type, NativeEventPayload>
    | UrbanEventDice<Type, NativeEventPayload>;

export type UrbanEventByType<
    Type,
    NativeEventPayload,
    T extends UrbanEvent<Type, NativeEventPayload>['type']
> = T extends 'text'
    ? UrbanEventText<Type, NativeEventPayload>
    : T extends 'command'
    ? UrbanEventCommand<Type, NativeEventPayload>
    : T extends 'pool'
    ? UrbanEventPoll<Type, NativeEventPayload>
    : T extends 'sticker'
    ? UrbanEventSticker<Type, NativeEventPayload>
    : T extends 'animation'
    ? UrbanEventAnimation<Type, NativeEventPayload>
    : T extends 'audio'
    ? UrbanEventAudio<Type, NativeEventPayload>
    : T extends 'contact'
    ? UrbanEventContact<Type, NativeEventPayload>
    : T extends 'document'
    ? UrbanEventDocument<Type, NativeEventPayload>
    : T extends 'invoice'
    ? UrbanEventInvoice<Type, NativeEventPayload>
    : T extends 'location'
    ? UrbanEventLocation<Type, NativeEventPayload>
    : T extends 'image'
    ? UrbanEventImage<Type, NativeEventPayload>
    : T extends 'dice'
    ? UrbanEventDice<Type, NativeEventPayload>
    : T extends 'voice'
    ? UrbanEventVoice<Type, NativeEventPayload>
    : T extends 'action'
    ? UrbanEventAction<Type, NativeEventPayload>
    : T extends 'video'
    ? UrbanEventVideo<Type, NativeEventPayload>
    : UrbanEvent<Type, NativeEventPayload>;

export type UrbanListenerByType<
    Type,
    NativeEventPayload,
    T extends UrbanEvent<Type, NativeEventPayload>['type']
> = UrbanListener<UrbanEventByType<Type, NativeEventPayload, T>>;

export type UrbanEventType<Type, NativeEventPayload> = UrbanEvent<Type, NativeEventPayload>['type'];
