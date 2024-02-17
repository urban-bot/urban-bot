import TelegramBot from 'node-telegram-bot-api';
import type { UrbanFile } from '@urban-bot/core';

export type TELEGRAM = 'TELEGRAM';

export type TelegramBotLostMessage = {
    dice?: {
        value: number;
    };
};
export type TelegramBotMessage = TelegramBot.Message & TelegramBotLostMessage;
export type TelegramPayload = TelegramBotMessage | TelegramBot.CallbackQuery;

export type TelegramMessageMeta = TelegramBotMessage;

export type InputMedia = TelegramBot.InputMedia;

export type InputVideoNote = TelegramBot.InputMediaBase & {
    type: 'video_note';
    duration?: number;
    media?: string;
};

export type InputVoice = TelegramBot.InputMediaBase & {
    type: 'voice';
    duration?: number;
    title?: string;
};

export type InputMediaAudio = TelegramBot.InputMediaBase & {
    type: 'audio';
    duration?: number;
    performer?: string;
    title?: string;
};

export type InputMediaFile = TelegramBot.InputMediaBase & {
    type: 'document';
    title?: string;
};

export type InputMediaAnimation = TelegramBot.InputMediaBase & {
    type: 'animation';
    duration?: number;
    title?: string;
};

export type UrbanNativeEventTelegram<Payload = TelegramPayload> = {
    type: TELEGRAM;
    payload?: Payload;
};
export type UrbanBotTelegramType<Payload = TelegramPayload> = {
    NativeEvent: UrbanNativeEventTelegram<Payload>;
    MessageMeta: TelegramMessageMeta;
};

export type TelegramOptions = {
    token: string;
    isPolling?: boolean;
    pathnamePrefix?: string;
    [key: string]: any;
};

export type MediaGroupCollector = {
    timeoutId: NodeJS.Timeout | null;
    mediaGroupId: string | null;
    text: string;
    files: UrbanFile[];
};
