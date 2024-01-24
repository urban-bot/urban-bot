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
