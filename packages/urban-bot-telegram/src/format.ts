/* eslint-disable @typescript-eslint/camelcase */
import { UrbanBotType, UrbanButton, UrbanExistingMessageByType, UrbanMessage, UrbanParseMode } from '@urban-bot/core';
import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api';

export type EditMessageOptions =
    | TelegramBot.EditMessageTextOptions
    | TelegramBot.EditMessageCaptionOptions
    | TelegramBot.EditMessageLiveLocationOptions
    | TelegramBot.EditMessageReplyMarkupOptions;

function formatKeyboard(message: UrbanMessage): InlineKeyboardButton[][] {
    const buttons = message.data.buttons as UrbanButton[] | UrbanButton[][];

    const formatButtons = ({ id, webApp, ...other }: UrbanButton) => ({
        ...(webApp ? { web_app: webApp } : { callback_data: id }),
        ...other,
    });

    if (Array.isArray(buttons[0])) {
        return (buttons as UrbanButton[][]).map((elem) => {
            const buttons = Array.isArray(elem) ? elem : [elem];
            return buttons.map(formatButtons);
        });
    }

    return [(buttons as UrbanButton[]).map(formatButtons)];
}

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

    if (message.data.buttons !== undefined) {
        const buttons = formatKeyboard(message);

        if (message.data.isReplyButtons === true) {
            return {
                keyboard: buttons,
                resize_keyboard:
                    typeof message.data.isResizedKeyboard === 'boolean' ? message.data.isResizedKeyboard : undefined,
            };
        }

        return {
            inline_keyboard: buttons,
        };
    }

    if ('isRemoveKeyboard' in message.data && message.data.isRemoveKeyboard) {
        return {
            remove_keyboard: true,
        };
    }
}

function formatReplyMarkupForExistingMessage(message: UrbanMessage) {
    if (message.data.buttons !== undefined) {
        return {
            inline_keyboard: formatKeyboard(message),
        };
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

    if (message.nodeName === 'urban-text' || message.nodeName === 'urban-buttons') {
        if (message.data.disableWebPagePreview === true) {
            return {
                parse_mode,
                disable_web_page_preview: true,
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
    message: UrbanExistingMessageByType<
        UrbanBotType,
        | 'urban-img'
        | 'urban-audio'
        | 'urban-voice'
        | 'urban-video'
        | 'urban-video-note'
        | 'urban-file'
        | 'urban-animation'
    >,
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
        case 'urban-voice': {
            return {
                ...common,
                type: 'voice',
                duration: message.data.duration,
                performer: message.data.author,
                title: message.data.title,
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
        case 'urban-video-note': {
            return {
                ...common,
                type: 'video_note',
                duration: message.data.duration,
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
