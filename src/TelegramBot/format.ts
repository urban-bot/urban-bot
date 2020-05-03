/* eslint-disable @typescript-eslint/camelcase */
import { UrbanExistingMessageByType, UrbanMessage } from '../types/Messages';
import TelegramBot from 'node-telegram-bot-api';
import { UrbanParseMode } from '../types';

export type EditMessageOptions =
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
        (message.nodeName === 'urban-buttons' ||
            message.nodeName === 'urban-img' ||
            message.nodeName === 'urban-file' ||
            message.nodeName === 'urban-poll' ||
            message.nodeName === 'urban-audio') &&
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
        (message.nodeName === 'urban-buttons' ||
            message.nodeName === 'urban-img' ||
            message.nodeName === 'urban-file' ||
            message.nodeName === 'urban-poll' ||
            message.nodeName === 'urban-audio') &&
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

export function getTelegramMedia(
    message: UrbanExistingMessageByType<'urban-img' | 'urban-audio' | 'urban-video' | 'urban-file' | 'urban-animation'>,
    parseMode: TelegramBot.ParseMode | undefined,
) {
    const common = {
        caption: message.data.title,
        parse_mode: parseMode,
    } as const;

    switch (message.nodeName) {
        case 'urban-img': {
            return {
                ...common,
                type: 'photo',
            } as const;
        }
        case 'urban-audio': {
            return {
                ...common,
                type: 'audio',
                duration: message.data.duration,
                performer: message.data.author,
                title: message.data.name,
            } as const;
        }
        case 'urban-video': {
            return {
                ...common,
                type: 'video',
                duration: message.data.duration,
                height: message.data.height,
                width: message.data.width,
            } as const;
        }
        case 'urban-animation': {
            return {
                ...common,
                type: 'animation',
                duration: message.data.duration,
                height: message.data.height,
                width: message.data.width,
            } as const;
        }
        case 'urban-file': {
            return {
                ...common,
                type: 'document',
            } as const;
        }
        default: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error((message as any).nodeName + ' doesn\t support');
        }
    }
}
