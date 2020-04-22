/* eslint-disable @typescript-eslint/camelcase */
import { UrbanMessage } from '../types/Messages';
import TelegramBot from 'node-telegram-bot-api';
import { UrbanParseMode } from '../types/index';

type EditMessageOptions =
    | TelegramBot.EditMessageTextOptions
    | TelegramBot.EditMessageCaptionOptions
    | TelegramBot.EditMessageLiveLocationOptions
    | TelegramBot.EditMessageReplyMarkupOptions;

function formatReplyMarkupForNewMessage(message: UrbanMessage) {
    if (message.data.forceReply !== undefined) {
        const replyMarkup: TelegramBot.ForceReply = {
            force_reply: message.data.forceReply,
        };

        if ('selective' in message.data && typeof message.data.selective === 'boolean') {
            replyMarkup.selective = message.data.selective;
        }

        return replyMarkup;
    }

    if (
        (message.nodeName === 'urban-buttons' || message.nodeName === 'urban-img') &&
        message.data.buttons !== undefined
    ) {
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

function formatReplyMarkupForExistingMessage(message: UrbanMessage) {
    if (
        (message.nodeName === 'urban-buttons' || message.nodeName === 'urban-img') &&
        message.data.buttons !== undefined
    ) {
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

function formatParams(message: UrbanMessage) {
    const parse_mode = formatParseMode(message.data.parseMode);

    if (message.nodeName === 'urban-text') {
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

export function formatParamsForNewMessage(message: UrbanMessage): TelegramBot.SendMessageOptions {
    const params: TelegramBot.SendMessageOptions = formatParams(message);

    if (message.data.replyToMessageId !== undefined) {
        params.reply_to_message_id = Number(message.data.replyToMessageId);
    }

    params.reply_markup = formatReplyMarkupForNewMessage(message);

    return params;
}

export function formatParamsForExistingMessage(message: UrbanMessage): EditMessageOptions {
    const params: EditMessageOptions = formatParams(message);

    params.reply_markup = formatReplyMarkupForExistingMessage(message);

    return params;
}
