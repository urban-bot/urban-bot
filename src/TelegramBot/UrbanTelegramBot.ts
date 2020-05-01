/* eslint-disable @typescript-eslint/camelcase */
import TelegramBot from 'node-telegram-bot-api';
import {
    UrbanSyntheticEvent,
    UrbanSyntheticEventVoice,
    UrbanSyntheticEventText,
    UrbanSyntheticEventDice,
    UrbanSyntheticEventVideo,
    UrbanSyntheticEventPoll,
    UrbanSyntheticEventImage,
    UrbanSyntheticEventLocation,
    UrbanSyntheticEventInvoice,
    UrbanSyntheticEventCommand,
    UrbanSyntheticEventSticker,
    UrbanSyntheticEventFile,
    UrbanSyntheticEventContact,
    UrbanSyntheticEventAudio,
    UrbanSyntheticEventAnimation,
    UrbanSyntheticEventAction,
    UrbanSyntheticEventType,
    UrbanSyntheticEventCommon,
} from '../types/Events';
import { UrbanBotType, UrbanBot } from '../types/UrbanBot';
import { UrbanExistingMessage, UrbanExistingMessageByType, UrbanMessage } from '../types/Messages';
import {
    EditMessageOptions,
    formatParamsForExistingMessage,
    formatParamsForNewMessage,
    getTelegramMedia,
} from './format';
import {
    TelegramMessageMeta,
    TelegramPayload,
    TelegramBotMessage,
    TELEGRAM,
    InputMediaAudio,
    InputMediaFile,
} from './types';

export type UrbanNativeEventTelegram<Payload = TelegramPayload> = {
    type: TELEGRAM;
    payload: Payload;
};

export type TelegramBotType = UrbanBotType & {
    NativeEvent: UrbanNativeEventTelegram;
    MessageMeta: TelegramMessageMeta;
};

export class UrbanTelegramBot implements UrbanBot<TelegramBotType> {
    static TYPE = 'TELEGRAM' as const;
    type = UrbanTelegramBot.TYPE;

    bot: TelegramBot;

    constructor(token: string, options?: TelegramBot.ConstructorOptions) {
        this.bot = new TelegramBot(token, options);

        this.bot.on('text', (ctx) => this.handleMessage('text', ctx));
        this.bot.on('callback_query', this.handleCallbackQuery);
        this.bot.on('sticker', (ctx) => this.handleMessage('sticker', ctx));
        this.bot.on('animation', (ctx) => this.handleMessage('animation', ctx));
        this.bot.on('audio', (ctx) => this.handleMessage('audio', ctx));
        this.bot.on('contact', (ctx) => this.handleMessage('contact', ctx));
        this.bot.on('document', (ctx) => this.handleMessage('file', ctx));
        this.bot.on('invoice', (ctx) => this.handleMessage('invoice', ctx));
        this.bot.on('location', (ctx) => this.handleMessage('location', ctx));
        this.bot.on('photo', (ctx) => this.handleMessage('image', ctx));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.bot.on('poll' as any, (ctx) => this.handleMessage('poll', (ctx as unknown) as TelegramBotMessage));
        this.bot.on('video', (ctx) => this.handleMessage('video', ctx));
        this.bot.on('voice', (ctx) => this.handleMessage('voice', ctx));
        this.bot.on('message', (ctx) => {
            const ctxWithDice: TelegramBotMessage = ctx;

            if (ctxWithDice.dice !== undefined) {
                this.handleMessage('dice', ctxWithDice);

                return;
            }
        });
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanNativeEventTelegram>) {
        throw new Error('this method must be overridden');
    }

    handleMessage = (type: UrbanSyntheticEventType<UrbanNativeEventTelegram>, ctx: TelegramBotMessage) => {
        const common: UrbanSyntheticEventCommon<UrbanNativeEventTelegram<TelegramBotMessage>> = {
            chat: {
                id: String(ctx.chat.id),
            },
            from: {
                id: String(ctx.from?.id),
                username: ctx.from?.username,
                firstName: ctx.from?.first_name,
                surname: ctx.from?.last_name,
            },
            nativeEvent: {
                type: UrbanTelegramBot.TYPE,
                payload: ctx,
            },
        };

        switch (type) {
            case 'text': {
                if (ctx.text === undefined) {
                    break;
                }

                if (ctx.text[0] === '/') {
                    const adaptedContext: UrbanSyntheticEventCommand<UrbanNativeEventTelegram<TelegramBot.Message>> = {
                        ...common,
                        type: 'command',
                        payload: {
                            command: ctx.text,
                        },
                    };

                    this.processUpdate(adaptedContext);
                } else {
                    const adaptedContext: UrbanSyntheticEventText<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                        ...common,
                        type: 'text',
                        payload: {
                            text: ctx.text,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                break;
            }
            case 'dice': {
                if (ctx.dice === undefined) {
                    break;
                }
                const adaptedContext: UrbanSyntheticEventDice<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'dice',
                    payload: {
                        value: ctx.dice.value,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'poll': {
                if (ctx.poll === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventPoll<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'poll',
                    payload: {
                        id: ctx.poll.id,
                        question: ctx.poll.question,
                        options: ctx.poll.options.map((option) => {
                            return { text: option.text, count: option.voter_count };
                        }),
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'sticker': {
                if (ctx.sticker === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventSticker<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'sticker',
                    payload: {
                        emoji: ctx.sticker.emoji,
                        id: ctx.sticker.file_id,
                        size: ctx.sticker.file_size,
                        width: ctx.sticker.width,
                        height: ctx.sticker.height,
                        name: ctx.sticker.set_name,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'animation': {
                if (ctx.animation === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventAnimation<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'animation',
                    payload: {
                        duration: ctx.animation.duration,
                        fileName: ctx.animation.file_name,
                        mimeType: ctx.animation.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'audio': {
                if (ctx.audio === undefined) {
                    break;
                }

                const name = `${ctx.audio.performer ?? ''} ${ctx.audio.title ?? ''}`.trim();
                const adaptedContext: UrbanSyntheticEventAudio<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'audio',
                    payload: {
                        files: [
                            {
                                duration: ctx.audio.duration,
                                id: ctx.audio.file_id,
                                size: ctx.audio.file_size,
                                name,
                                mimeType: ctx.audio.mime_type,
                            },
                        ],
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'contact': {
                if (ctx.contact === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventContact<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'contact',
                    payload: {
                        firstName: ctx.contact.first_name,
                        phoneNumber: ctx.contact.phone_number,
                        lastName: ctx.contact.last_name,
                        userId: ctx.contact.user_id,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'file': {
                if (ctx.document === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventFile<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'file',
                    payload: {
                        files: [
                            {
                                id: ctx.document.file_id,
                                name: ctx.document.file_name,
                                size: ctx.document.file_size,
                                mimeType: ctx.document.mime_type,
                            },
                        ],
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'invoice': {
                if (ctx.invoice === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventInvoice<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'invoice',
                    payload: {
                        currency: ctx.invoice.currency,
                        description: ctx.invoice.description,
                        title: ctx.invoice.title,
                        startParameter: ctx.invoice.start_parameter,
                        totalAmount: ctx.invoice.total_amount,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'location': {
                if (ctx.location === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventLocation<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'location',
                    payload: {
                        latitude: ctx.location.latitude,
                        longitude: ctx.location.longitude,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'image': {
                if (ctx.photo === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventImage<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'image',
                    payload: {
                        files: ctx.photo.map((photo) => ({
                            id: photo.file_id,
                            size: photo.file_size,
                            width: photo.width,
                            height: photo.height,
                        })),
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'video': {
                if (ctx.video === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventVideo<UrbanNativeEventTelegram<TelegramBot.Message>> = {
                    ...common,
                    type: 'video',
                    payload: {
                        files: [
                            {
                                duration: ctx.video.duration,
                                id: ctx.video.file_id,
                                size: ctx.video.file_size,
                                mimeType: ctx.video.mime_type,
                            },
                        ],
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'voice': {
                if (ctx.voice === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventVoice<UrbanNativeEventTelegram<TelegramBotMessage>> = {
                    ...common,
                    type: 'voice',
                    payload: {
                        duration: ctx.voice.duration,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
        }
    };

    handleCallbackQuery = (ctx: TelegramBot.CallbackQuery) => {
        if (ctx.message?.chat !== undefined && ctx.data !== undefined) {
            const adaptedContext: UrbanSyntheticEventAction<UrbanNativeEventTelegram<TelegramBot.CallbackQuery>> = {
                type: 'action',
                chat: {
                    id: String(ctx.message.chat.id),
                },
                from: {
                    id: String(ctx.from?.id),
                    username: ctx.from?.username,
                    firstName: ctx.from?.first_name,
                    surname: ctx.from?.last_name,
                },
                payload: {
                    actionId: ctx.data,
                },
                nativeEvent: {
                    type: UrbanTelegramBot.TYPE,
                    payload: ctx,
                },
            };

            this.processUpdate(adaptedContext);
        }
    };

    sendMessage(message: UrbanMessage) {
        switch (message.nodeName) {
            case 'urban-text': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendMessage(message.chat.id, message.data.text, params);
            }
            case 'urban-img': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendPhoto(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });
            }
            case 'urban-buttons': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendMessage(message.chat.id, message.data.title, params);
            }
            case 'urban-audio': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendAudio(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    performer: message.data.author,
                    title: message.data.name,
                });
            }
            case 'urban-video': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendVideo(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    width: message.data.width,
                    height: message.data.height,
                });
            }
            case 'urban-file': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendDocument(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    updateMessage(message: UrbanExistingMessage<TelegramMessageMeta>) {
        switch (message.nodeName) {
            case 'urban-text': {
                const metaToEdit = {
                    chat_id: message.meta.chat.id,
                    message_id: message.meta.message_id,
                };

                const params = formatParamsForExistingMessage(message);

                this.bot.editMessageText(message.data.text, { ...params, ...metaToEdit });

                break;
            }
            case 'urban-img': {
                this.editMedia(message);

                break;
            }
            case 'urban-audio': {
                this.editMedia(message);

                break;
            }
            case 'urban-video': {
                this.editMedia(message);

                break;
            }
            case 'urban-file': {
                this.editMedia(message);

                break;
            }
            case 'urban-buttons': {
                const metaToEdit = {
                    chat_id: message.meta.chat.id,
                    message_id: message.meta.message_id,
                };

                const params = formatParamsForExistingMessage(message);

                this.bot.editMessageText(message.data.title, { ...params, ...metaToEdit });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    deleteMessage(message: UrbanExistingMessage<TelegramMessageMeta>) {
        this.bot.deleteMessage(message.meta.chat.id, String(message.meta.message_id));
    }

    editMedia(
        message: UrbanExistingMessageByType<
            'urban-img' | 'urban-audio' | 'urban-video' | 'urban-file',
            TelegramMessageMeta
        >,
    ) {
        const metaToEdit = {
            chat_id: message.meta.chat.id,
            message_id: message.meta.message_id,
        } as const;
        const params = formatParamsForExistingMessage(message);
        const media = getTelegramMedia(message, 'parse_mode' in params ? params.parse_mode : undefined);

        if (typeof message.data.file !== 'string') {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const fileData = this.bot._formatSendData('file', message.data.file);
                const { file } = fileData[0];

                this.editMessageMedia({ ...media, media: `attach://file` }, { ...params, ...metaToEdit }, { file });
            } catch (e) {
                console.error('Something wrong with edit file message.');
                console.error(e);
            }

            return;
        }

        this.editMessageMedia({ ...media, media: message.data.file }, { ...params, ...metaToEdit });
    }

    // FIXME this methods should be fixed in node-telegram-bot-api
    editMessageMedia(
        media: TelegramBot.InputMedia | InputMediaAudio | InputMediaFile,
        options: EditMessageOptions,
        formData?: unknown,
    ) {
        const qs = { ...options, media: JSON.stringify(media) };
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.bot._request('editMessageMedia', { qs, formData });
    }
}
