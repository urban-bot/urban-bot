/* eslint-disable @typescript-eslint/camelcase */
import { UrbanBotNewMessage } from '../types/Messages';
import TelegramBot from 'node-telegram-bot-api';
import { UrbanParseMode } from '../types/index';

type EditMessageOptions =
    | TelegramBot.EditMessageTextOptions
    | TelegramBot.EditMessageCaptionOptions
    | TelegramBot.EditMessageLiveLocationOptions
    | TelegramBot.EditMessageReplyMarkupOptions;

function formatReplyMarkupForNewMessage(message: UrbanBotNewMessage) {
    if (message.data.forceReply !== undefined) {
        const replyMarkup: TelegramBot.ForceReply = {
            force_reply: message.data.forceReply,
        };

        if ('selective' in message.data && typeof message.data.selective === 'boolean') {
            replyMarkup.selective = message.data.selective;
        }

        return replyMarkup;
    }

    if ((message.nodeName === 'buttons' || message.nodeName === 'img') && message.data.buttons !== undefined) {
        const replyMarkup: TelegramBot.InlineKeyboardMarkup = {
            inline_keyboard: [
                message.data.buttons.map(({ text, id }) => {
                    return { text, callback_data: id };
                }),
            ],
        };

        return replyMarkup;
    }
}

function formatReplyMarkupForExistingMessage(message: UrbanBotNewMessage) {
    if ((message.nodeName === 'buttons' || message.nodeName === 'img') && message.data.buttons !== undefined) {
        const replyMarkup: TelegramBot.InlineKeyboardMarkup = {
            inline_keyboard: [
                message.data.buttons.map(({ text, id }) => {
                    return { text, callback_data: id };
                }),
            ],
        };

        return replyMarkup;
    }
}

function formatParseMode(parseMode: UrbanParseMode | undefined) {
    if (parseMode === undefined) {
        return undefined;
    }

    return parseMode === 'HTML' ? 'HTML' : 'MarkdownV2';
}

function formatParams(message: UrbanBotNewMessage) {
    const parse_mode = formatParseMode(message.data.parseMode);

    if (message.nodeName === 'text') {
        if (message.data.disableWebPagePreview === true) {
            return {
                parse_mode,
                disable_web_page_preview: message.data.disableWebPagePreview,
            } as const;
        }
    }

    return {
        parse_mode,
    } as const;
}

export function formatParamsForNewMessage(message: UrbanBotNewMessage): TelegramBot.SendMessageOptions {
    const params: TelegramBot.SendMessageOptions = formatParams(message);

    if (message.data.replyToMessageId !== undefined) {
        params.reply_to_message_id = Number(message.data.replyToMessageId);
    }

    params.reply_markup = formatReplyMarkupForNewMessage(message);

    console.log(params.reply_markup);

    return params;
}

export function formatParamsForExistingMessage(message: UrbanBotNewMessage): EditMessageOptions {
    const params: EditMessageOptions = formatParams(message);

    params.reply_markup = formatReplyMarkupForExistingMessage(message);

    return params;
}
