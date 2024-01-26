import type { UrbanBotType, UrbanFile } from '../bot';
import type { UrbanSyntheticEventCommon } from './UrbanSyntheticEventCommon';

export interface UrbanSyntheticEventAction<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'action';
    payload: {
        actionId: string;
    };
}

export interface UrbanSyntheticEventCommand<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'command';
    payload: {
        messageId: string;
        command: string;
        argument?: string;
    };
}

export interface UrbanSyntheticEventSticker<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'sticker';
    payload: {
        messageId: string;
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
        messageId: string;
        value: number;
    };
}

export interface UrbanSyntheticEventText<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'text';
    payload: {
        messageId: string;
        text: string;
    };
}

export interface UrbanSyntheticEventAnimation<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'animation';
    payload: {
        messageId: string;
        duration: number;
        name?: string;
        mimeType?: string;
        text?: string;
        fileId?: string;
    };
}

export interface UrbanSyntheticEventAudio<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'audio';
    payload: {
        messageId: string;
        fileId?: string;
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventContact<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'contact';
    payload: {
        messageId: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        userId?: string | number;
    };
}

export interface UrbanSyntheticEventFile<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'file';
    payload: {
        messageId: string;
        fileId?: string;
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventInvoice<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'invoice';
    payload: {
        messageId: string;
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
        messageId: string;
        latitude: number;
        longitude: number;
    };
}

export interface UrbanSyntheticEventImage<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'image';
    payload: {
        messageId: string;
        fileId?: string;
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventPoll<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'poll';
    payload: {
        messageId: string;
        id?: string | number;
        question: string;
        options: Array<{ id?: string | number; text: string; count?: number }>;
    };
}

export interface UrbanSyntheticEventVideo<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'video';
    payload: {
        messageId: string;
        fileId?: string;
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventVoice<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'voice';
    payload: {
        messageId: string;
        fileId?: string;
        duration?: number;
        mimeType?: string;
    };
}

export interface UrbanSyntheticEventVideoNote<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'video_note';
    payload: {
        messageId: string;
        fileId?: string;
        duration?: number;
        length?: number;
    };
}

export interface UrbanSyntheticEventMediaGroup<BotType extends UrbanBotType>
    extends UrbanSyntheticEventCommon<BotType> {
    type: 'media_group';
    payload: {
        mediaGroupId: string;
        text?: string;
        files: UrbanFile[];
    };
}

export interface UrbanSyntheticEventAny<BotType extends UrbanBotType> extends UrbanSyntheticEventCommon<BotType> {
    type: 'any';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}
