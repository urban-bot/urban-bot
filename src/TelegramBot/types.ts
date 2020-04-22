import { UrbanEvent } from '../types/Events';
import TelegramBot from 'node-telegram-bot-api';

export type TELEGRAM = 'TELEGRAM';

export type ProcessUpdate<Type, NativeEventPayload> = (event: UrbanEvent<Type, NativeEventPayload>) => void;

export type TelegramBotLostMessage = {
    dice?: {
        value: number;
    };
};
export type TelegramBotMessage = TelegramBot.Message & TelegramBotLostMessage;
export type TelegramPayload = TelegramBotMessage | TelegramBot.CallbackQuery;

export type TelegramMessageMeta = TelegramBotMessage;
