import { UrbanNativeEvent, UrbanSyntheticEvent } from '../types/Events';
import TelegramBot from 'node-telegram-bot-api';

export type TELEGRAM = 'TELEGRAM';

export type ProcessUpdate<NativeEvent extends UrbanNativeEvent> = (event: UrbanSyntheticEvent<NativeEvent>) => void;

export type TelegramBotLostMessage = {
    dice?: {
        value: number;
    };
};
export type TelegramBotMessage = TelegramBot.Message & TelegramBotLostMessage;
export type TelegramPayload = TelegramBotMessage | TelegramBot.CallbackQuery;

export type TelegramMessageMeta = TelegramBotMessage;

export type InputMediaAudio = TelegramBot.InputMediaBase & {
    type: 'audio';
    duration?: number;
    performer?: string;
    title?: string;
};
