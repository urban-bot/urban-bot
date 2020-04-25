/* eslint-disable @typescript-eslint/camelcase */
import TelegramBot from 'node-telegram-bot-api';
import {
    UrbanEvent,
    UrbanEventVoice,
    UrbanEventText,
    UrbanEventDice,
    UrbanEventVideo,
    UrbanEventPoll,
    UrbanEventImage,
    UrbanEventLocation,
    UrbanEventInvoice,
    UrbanEventCommand,
    UrbanEventSticker,
    UrbanEventFile,
    UrbanEventContact,
    UrbanEventAudio,
    UrbanEventAnimation,
    UrbanEventAction,
    UrbanEventType,
    UrbanEventCommon,
} from '../types/Events';
import { UrbanBot } from '../types/UrbanBot';
import { UrbanExistingMessage, UrbanMessage } from '../types/Messages';
import { EditMessageOptions, formatParamsForExistingMessage, formatParamsForNewMessage } from './format';
import { TelegramMessageMeta, TELEGRAM, TelegramPayload, TelegramBotMessage } from './types';

export class UrbanTelegramBot implements UrbanBot<TELEGRAM, TelegramPayload, TelegramMessageMeta> {
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

    processUpdate(_event: UrbanEvent<TELEGRAM, TelegramPayload>) {
        throw new Error('this method must be overridden');
    }

    handleMessage = (type: UrbanEventType<TELEGRAM, TelegramPayload>, ctx: TelegramBotMessage) => {
        const common: UrbanEventCommon<TELEGRAM, TelegramBotMessage> = {
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
                    const adaptedContext: UrbanEventCommand<TELEGRAM, TelegramBot.Message> = {
                        ...common,
                        type: 'command',
                        payload: {
                            command: ctx.text,
                        },
                    };

                    this.processUpdate(adaptedContext);
                } else {
                    const adaptedContext: UrbanEventText<TELEGRAM, TelegramBotMessage> = {
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
                const adaptedContext: UrbanEventDice<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventPoll<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventSticker<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventAnimation<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventAudio<TELEGRAM, TelegramBotMessage> = {
                    ...common,
                    type: 'audio',
                    payload: {
                        duration: ctx.audio.duration,
                        performer: ctx.audio.performer,
                        title: ctx.audio.title,
                        mimeType: ctx.audio.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'contact': {
                if (ctx.contact === undefined) {
                    break;
                }

                const adaptedContext: UrbanEventContact<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventFile<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventInvoice<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventLocation<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventImage<TELEGRAM, TelegramBotMessage> = {
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

                const adaptedContext: UrbanEventVideo<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventVoice<TELEGRAM, TelegramBotMessage> = {
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
            const adaptedContext: UrbanEventAction<TELEGRAM, TelegramBot.CallbackQuery> = {
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

                return this.bot.sendPhoto(message.chat.id, message.data.image, {
                    ...params,
                    caption: message.data.title,
                });
            }
            case 'urban-buttons': {
                const params = formatParamsForNewMessage(message);

                return this.bot.sendMessage(message.chat.id, message.data.title, params);
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
                const metaToEdit = {
                    chat_id: message.meta.chat.id,
                    message_id: message.meta.message_id,
                };

                const params = formatParamsForExistingMessage(message);
                const media = {
                    type: 'photo',
                    caption: message.data.title,
                    parse_mode: 'parse_mode' in params ? params.parse_mode : undefined,
                } as const;

                if (typeof message.data.image !== 'string') {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        const photoData = this.bot._formatSendData('photo', message.data.image);
                        const { photo } = photoData[0];

                        this.editMessageMedia(
                            { ...media, media: `attach://photo` },
                            { ...params, ...metaToEdit },
                            { photo },
                        );
                    } catch (e) {
                        console.error('Something wrong with edit img message.');
                        console.error(e);
                    }

                    break;
                }

                this.editMessageMedia({ ...media, media: message.data.image }, { ...params, ...metaToEdit });

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

    // FIXME this methods should be fixed in node-telegram-bot-api
    editMessageMedia(media: TelegramBot.InputMedia, options: EditMessageOptions, formData?: unknown) {
        const qs = { ...options, media: JSON.stringify(media) };
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.bot._request('editMessageMedia', { qs, formData });
    }
}
