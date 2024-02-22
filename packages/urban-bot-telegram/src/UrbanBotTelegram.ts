/* eslint-disable @typescript-eslint/camelcase */
import express from 'express';
import TelegramBot, { PollType } from 'node-telegram-bot-api';
import { getDefaultCollectorState } from './utils';
import {
    EditMessageOptions,
    formatParamsForExistingMessage,
    formatParamsForNewMessage,
    getTelegramMedia,
} from './format';
import type {
    UrbanSyntheticEvent,
    UrbanSyntheticEventVoice,
    UrbanSyntheticEventText,
    UrbanSyntheticEventDice,
    UrbanSyntheticEventVideo,
    UrbanSyntheticEventVideoNote,
    UrbanSyntheticEventPoll,
    UrbanSyntheticEventImage,
    UrbanSyntheticEventLocation,
    UrbanSyntheticEventInvoice,
    UrbanSyntheticEventCommand,
    UrbanSyntheticEventSticker,
    UrbanSyntheticEventFile,
    UrbanSyntheticEventMediaGroup,
    UrbanSyntheticEventContact,
    UrbanSyntheticEventAudio,
    UrbanSyntheticEventAnimation,
    UrbanSyntheticEventAction,
    UrbanSyntheticEventType,
    UrbanSyntheticEventCommon,
    UrbanBot,
    UrbanExistingMessage,
    UrbanMessage,
    UrbanCommand,
    UrbanParseMode,
    UrbanExistingMessageByType,
} from '@urban-bot/core';
import type {
    TelegramBotMessage,
    InputMedia,
    InputMediaAudio,
    InputVoice,
    InputMediaFile,
    InputVideoNote,
    InputMediaAnimation,
    UrbanBotTelegramType,
    TelegramOptions,
    MediaGroupCollector,
} from './types';

export class UrbanBotTelegram implements UrbanBot<UrbanBotTelegramType> {
    static TYPE = 'TELEGRAM' as const;
    type = UrbanBotTelegram.TYPE;
    defaultParseMode: UrbanParseMode = 'HTML';
    commandPrefix = '/';
    client: TelegramBot;
    mediaGroupCollector: MediaGroupCollector = getDefaultCollectorState();

    constructor(public options: TelegramOptions) {
        const { isPolling, token, ...otherOptions } = options;
        this.client = new TelegramBot(token, isPolling ? { polling: true, ...otherOptions } : undefined);

        this.client.on('text', (ctx) => this.handleMessage('text', ctx));
        this.client.on('callback_query', this.handleCallbackQuery);
        this.client.on('sticker', (ctx) => this.handleMessage('sticker', ctx));
        this.client.on('animation', (ctx) => this.handleMessage('animation', ctx));
        this.client.on('audio', (ctx) => this.handleMessage('audio', ctx));
        this.client.on('contact', (ctx) => this.handleMessage('contact', ctx));
        this.client.on('document', (ctx) => this.handleMessage('file', ctx));
        this.client.on('invoice', (ctx) => this.handleMessage('invoice', ctx));
        this.client.on('location', (ctx) => this.handleMessage('location', ctx));
        this.client.on('photo', (ctx) => this.handleMessage('image', ctx));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.client.on('poll' as any, (ctx) => this.handleMessage('poll', (ctx as unknown) as TelegramBotMessage));
        this.client.on('video', (ctx) => this.handleMessage('video', ctx));
        this.client.on('voice', (ctx) => this.handleMessage('voice', ctx));
        this.client.on('video_note', (ctx) => this.handleMessage('video_note', ctx));
        this.client.on('message', (ctx) => {
            const ctxWithDice: TelegramBotMessage = ctx;

            if (ctxWithDice.dice !== undefined) {
                this.handleMessage('dice', ctxWithDice);

                return;
            }
        });

        this.client.on('animation', (ctx) => this.handleMessage('media_group', ctx));
        this.client.on('audio', (ctx) => this.handleMessage('media_group', ctx));
        this.client.on('photo', (ctx) => this.handleMessage('media_group', ctx));
        this.client.on('video', (ctx) => this.handleMessage('media_group', ctx));
        this.client.on('document', (ctx) => this.handleMessage('media_group', ctx));
    }

    initializeServer(expressApp: express.Express) {
        if (this.options.isPolling) {
            return;
        }

        const pathnamePrefix = this.options.pathnamePrefix ?? '';

        expressApp.use(`${pathnamePrefix}/telegram/*`, express.json());
        expressApp.post(`${pathnamePrefix}/telegram/bot${this.options.token}`, (req, res) => {
            this.client.processUpdate(req.body);
            res.sendStatus(200);
        });
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanBotTelegramType>) {
        throw new Error('this method must be overridden');
    }

    handleMessage = (type: UrbanSyntheticEventType<UrbanBotTelegramType>, ctx: TelegramBotMessage) => {
        if (!ctx.chat) {
            console.error("Chat information didn't come from Telegram event");
            console.error('Message type', type);
            console.error('Message context', ctx);

            return;
        }

        const common: UrbanSyntheticEventCommon<UrbanBotTelegramType> = {
            chat: {
                id: String(ctx.chat.id),
                type: ctx.chat.type,
                title: ctx.chat.title,
                username: ctx.chat.username,
                firstName: ctx.chat.first_name,
                lastName: ctx.chat.last_name,
                description: ctx.chat.description,
                inviteLink: ctx.chat.invite_link,
            },
            from: {
                id: String(ctx.from?.id),
                username: ctx.from?.username,
                firstName: ctx.from?.first_name,
                lastName: ctx.from?.last_name,
                isBot: ctx.from?.is_bot,
            },
            nativeEvent: {
                type: UrbanBotTelegram.TYPE,
                payload: ctx,
            },
        };

        switch (type) {
            case 'text': {
                if (!ctx.text) {
                    break;
                }

                if (ctx.text[0] === this.commandPrefix) {
                    const [command, ...args] = ctx.text.split(' ');
                    const adaptedContext: UrbanSyntheticEventCommand<UrbanBotTelegramType> = {
                        ...common,
                        type: 'command',
                        payload: {
                            command,
                            messageId: String(ctx.message_id),
                            argument: args.join(' '),
                        },
                    };

                    this.processUpdate(adaptedContext);
                } else {
                    const adaptedContext: UrbanSyntheticEventText<UrbanBotTelegramType> = {
                        ...common,
                        type: 'text',
                        payload: {
                            messageId: String(ctx.message_id),
                            text: ctx.text,
                        },
                    };

                    this.processUpdate(adaptedContext);
                }

                break;
            }
            case 'dice': {
                if (!ctx.dice) {
                    break;
                }
                const adaptedContext: UrbanSyntheticEventDice<UrbanBotTelegramType> = {
                    ...common,
                    type: 'dice',
                    payload: {
                        messageId: String(ctx.message_id),
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

                const adaptedContext: UrbanSyntheticEventPoll<UrbanBotTelegramType> = {
                    ...common,
                    type: 'poll',
                    payload: {
                        id: ctx.poll.id,
                        messageId: String(ctx.message_id),
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
                if (!ctx.sticker) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventSticker<UrbanBotTelegramType> = {
                    ...common,
                    type: 'sticker',
                    payload: {
                        messageId: String(ctx.message_id),
                        emoji: ctx.sticker.emoji,
                        id: ctx.sticker.file_id,
                        width: ctx.sticker.width,
                        height: ctx.sticker.height,
                        name: ctx.sticker.set_name,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'animation': {
                if (!ctx.animation) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventAnimation<UrbanBotTelegramType> = {
                    ...common,
                    type: 'animation',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.animation.file_id,
                        duration: ctx.animation.duration,
                        name: ctx.animation.file_name,
                        mimeType: ctx.animation.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'audio': {
                if (!ctx.audio) {
                    break;
                }

                const name = `${ctx.audio.performer ?? ''} ${ctx.audio.title ?? ''}`.trim();
                const adaptedContext: UrbanSyntheticEventAudio<UrbanBotTelegramType> = {
                    ...common,
                    type: 'audio',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.audio.file_id,
                        text: ctx.caption,
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
                if (!ctx.contact) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventContact<UrbanBotTelegramType> = {
                    ...common,
                    type: 'contact',
                    payload: {
                        messageId: String(ctx.message_id),
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
                if (!ctx.document) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventFile<UrbanBotTelegramType> = {
                    ...common,
                    type: 'file',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.document.file_id,
                        text: ctx.caption,
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
                if (!ctx.invoice) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventInvoice<UrbanBotTelegramType> = {
                    ...common,
                    type: 'invoice',
                    payload: {
                        messageId: String(ctx.message_id),
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
                if (!ctx.location) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventLocation<UrbanBotTelegramType> = {
                    ...common,
                    type: 'location',
                    payload: {
                        messageId: String(ctx.message_id),
                        latitude: ctx.location.latitude,
                        longitude: ctx.location.longitude,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'image': {
                if (!ctx.photo) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventImage<UrbanBotTelegramType> = {
                    ...common,
                    type: 'image',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.photo?.[0].file_id,
                        text: ctx.caption,
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
                if (!ctx.video) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventVideo<UrbanBotTelegramType> = {
                    ...common,
                    type: 'video',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.video.file_id,
                        text: ctx.caption,
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
                if (!ctx.voice) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventVoice<UrbanBotTelegramType> = {
                    ...common,
                    type: 'voice',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.voice.file_id,
                        duration: ctx.voice.duration,
                        mimeType: ctx.voice.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'video_note': {
                if (!ctx.video_note) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventVideoNote<UrbanBotTelegramType> = {
                    ...common,
                    type: 'video_note',
                    payload: {
                        messageId: String(ctx.message_id),
                        fileId: ctx.video_note.file_id,
                        duration: ctx.video_note.duration,
                        length: ctx.video_note.length,
                    },
                };

                this.processUpdate(adaptedContext);

                break;
            }
            case 'media_group': {
                if (!ctx.media_group_id) {
                    break;
                }

                if (!this.mediaGroupCollector.mediaGroupId) {
                    this.mediaGroupCollector.mediaGroupId = ctx.media_group_id;
                }

                if (!this.mediaGroupCollector.text) {
                    this.mediaGroupCollector.text = ctx.caption ?? '';
                }

                if (this.mediaGroupCollector.mediaGroupId === ctx.media_group_id) {
                    if (ctx.photo) {
                        // take the last one because of the best quality
                        const photo = ctx.photo[ctx.photo.length - 1];

                        const file = {
                            id: photo.file_id,
                            size: photo.file_size,
                            width: photo.width,
                            height: photo.height,
                            type: 'image',
                        };

                        this.mediaGroupCollector.files.push(file);
                    }

                    if (ctx.video) {
                        const { video } = ctx;

                        const file = {
                            id: video.file_id,
                            duration: video.duration,
                            size: video.file_size,
                            mimeType: video.mime_type,
                            type: 'video',
                        };

                        this.mediaGroupCollector.files.push(file);
                    }

                    if (ctx.audio) {
                        const { audio } = ctx;
                        const name = `${ctx.audio.performer ?? ''} ${ctx.audio.title ?? ''}`.trim();

                        const file = {
                            name,
                            id: audio.file_id,
                            duration: audio.duration,
                            size: audio.file_size,
                            mimeType: audio.mime_type,
                            type: 'audio',
                        };

                        this.mediaGroupCollector.files.push(file);
                    }

                    if (ctx.animation) {
                        const { animation } = ctx;

                        const file = {
                            id: animation.file_id,
                            duration: animation.duration,
                            name: animation.file_name,
                            mimeType: animation.mime_type,
                            type: 'animation',
                        };

                        this.mediaGroupCollector.files.push(file);
                    }

                    if (ctx.document) {
                        const { document } = ctx;

                        const file = {
                            id: document.file_id,
                            name: document.file_name,
                            size: document.file_size,
                            mimeType: document.mime_type,
                            type: 'file',
                        };

                        this.mediaGroupCollector.files.push(file);
                    }
                }

                if (this.mediaGroupCollector.timeoutId && this.mediaGroupCollector.mediaGroupId) {
                    clearTimeout(this.mediaGroupCollector.timeoutId);
                }

                const adaptedContext: UrbanSyntheticEventMediaGroup<UrbanBotTelegramType> = {
                    ...common,
                    type: 'media_group',
                    payload: {
                        mediaGroupId: this.mediaGroupCollector.mediaGroupId,
                        files: this.mediaGroupCollector.files,
                        text: this.mediaGroupCollector.text,
                    },
                };

                const mediaGroupCallback = () => {
                    this.processUpdate(adaptedContext);

                    this.mediaGroupCollector = getDefaultCollectorState();
                };

                this.mediaGroupCollector.timeoutId = setTimeout(mediaGroupCallback, 1000);

                break;
            }
        }
    };

    handleCallbackQuery = (ctx: TelegramBot.CallbackQuery) => {
        if (ctx.message?.chat !== undefined && ctx.data !== undefined) {
            const adaptedContext: UrbanSyntheticEventAction<UrbanBotTelegramType> = {
                type: 'action',
                chat: {
                    id: String(ctx.message.chat.id),
                    type: ctx.message.chat.type,
                    title: ctx.message.chat.title,
                    username: ctx.message.chat.username,
                    firstName: ctx.message.chat.first_name,
                    lastName: ctx.message.chat.last_name,
                    description: ctx.message.chat.description,
                    inviteLink: ctx.message.chat.invite_link,
                },
                from: {
                    id: String(ctx.from?.id),
                    username: ctx.from?.username,
                    firstName: ctx.from?.first_name,
                    lastName: ctx.from?.last_name,
                },
                payload: {
                    actionId: ctx.data,
                },
                nativeEvent: {
                    type: UrbanBotTelegram.TYPE,
                    payload: ctx,
                },
            };

            this.processUpdate(adaptedContext);
        }
    };

    async sendMessage(message: UrbanMessage) {
        await this.simulateTyping(message.chat.id, message.data.simulateTyping);

        switch (message.nodeName) {
            case 'urban-text': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendMessage(message.chat.id, message.data.text, params);

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-img': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendPhoto(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-buttons': {
                const params = formatParamsForNewMessage(message);

                if (!message.data.title) {
                    throw new Error('@urban-bot/telegram Specify title prop to ButtonGroup');
                }

                const response = await this.client.sendMessage(message.chat.id, message.data.title, params);

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-audio': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendAudio(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    performer: message.data.author,
                    title: message.data.name,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-voice': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendVoice(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-video': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendVideo(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    width: message.data.width,
                    height: message.data.height,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-video-note': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendVideoNote(message.chat.id, message.data.file, {
                    ...params,
                    duration: message.data.duration,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-animation': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendAnimation(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    width: message.data.width,
                    height: message.data.height,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-file': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendDocument(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-location': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendLocation(
                    message.chat.id,
                    message.data.latitude,
                    message.data.longitude,
                    {
                        ...params,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore @types/node-telegram-bot-api bug. live_period is existed
                        live_period: message.data.livePeriodSeconds,
                    },
                );

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-media': {
                const params = formatParamsForNewMessage(message);

                const media = message.data.files.map((fileData, index) => {
                    const { type, file, ...other } = fileData;

                    const common = {
                        media: file,
                        parse_mode: message.data.parseMode,
                        // This trick allow to attach text to media group message
                        caption: index === 0 ? message.data.title : '',
                        ...other,
                    } as const;

                    switch (type) {
                        case 'image': {
                            return {
                                type: 'photo',
                                ...common,
                            } as const;
                        }
                        case 'video': {
                            return {
                                type: 'video',
                                ...common,
                            } as const;
                        }
                        default: {
                            throw new Error(`urban-media type '${type}' doesn't support`);
                        }
                    }
                });

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore @types/node-telegram-bot-api bug. File could be not only string
                const response = await this.client.sendMediaGroup(message.chat.id, media, params);

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-contact': {
                const params = formatParamsForNewMessage(message);

                const response = await this.client.sendContact(
                    message.chat.id,
                    String(message.data.phoneNumber),
                    message.data.firstName ?? '',
                    {
                        ...params,
                        last_name: message.data.lastName,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore @types/node-telegram-bot-api bug. Doesn't have vcard type
                        vcard: message.data.vCard,
                    },
                );

                message.data.onSent?.(response);

                return response;
            }
            case 'urban-poll': {
                const params = formatParamsForNewMessage(message);
                const options = message.data.options.map(({ text }) => text);

                const response = await this.client.sendPoll(message.chat.id, message.data.question, options, {
                    ...params,
                    is_anonymous: message.data.isAnonymous,
                    type: message.data.type as PollType,
                    allows_multiple_answers: message.data.withMultipleAnswers,
                    correct_option_id: Number(message.data.rightOption),
                    explanation: message.data.explanation,
                    explanation_parse_mode: params.parse_mode,
                    open_period: message.data.livePeriodSeconds,
                    close_date: message.data.close_time as number,
                });

                message.data.onSent?.(response);

                return response;
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' is not supported. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    updateMessage(message: UrbanExistingMessage<UrbanBotTelegramType>) {
        if (message.data.isReplyButtons === true) {
            throw new Error('Reply buttons can not edited. You could send a new message every time for this message.');
        }

        switch (message.nodeName) {
            case 'urban-text': {
                const metaToEdit = {
                    chat_id: message.meta.chat.id,
                    message_id: message.meta.message_id,
                };

                const params = formatParamsForExistingMessage(message);

                this.client.editMessageText(message.data.text, { ...params, ...metaToEdit });

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
            case 'urban-voice': {
                return this.editVoice(message);
            }
            case 'urban-video': {
                this.editMedia(message);

                break;
            }
            case 'urban-video-note': {
                return this.editVideoNote(message);
            }
            case 'urban-animation': {
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

                this.client.editMessageText(message.data.title, { ...params, ...metaToEdit });

                break;
            }
            case 'urban-location': {
                const metaToEdit = {
                    chat_id: message.meta.chat.id,
                    message_id: message.meta.message_id,
                };

                const params = formatParamsForExistingMessage(message);

                this.client.editMessageLiveLocation(message.data.latitude, message.data.longitude, {
                    ...params,
                    ...metaToEdit,
                });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' is not supported to update the message for @urban-bot/telegram. You could send a new message every time for this tag.`,
                );
            }
        }
    }

    deleteMessage(message: UrbanExistingMessage<UrbanBotTelegramType>) {
        if (Array.isArray(message.meta)) {
            message.meta.forEach(({ chat, message_id }) => {
                this.client.deleteMessage(chat.id, String(message_id));
            });
        } else {
            this.client.deleteMessage(message.meta.chat.id, String(message.meta.message_id));
        }
    }

    initializeCommands(commands: UrbanCommand[]) {
        // FIXME this methods should be fixed in node-telegram-bot-api
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.client._request('setMyCommands', {
            form: {
                commands: JSON.stringify(commands),
            },
        });
    }

    editMedia(
        message: UrbanExistingMessageByType<
            UrbanBotTelegramType,
            'urban-img' | 'urban-audio' | 'urban-video' | 'urban-file' | 'urban-animation'
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
                const fileData = this.client._formatSendData('file', message.data.file);
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

    async editVoice(message: UrbanExistingMessageByType<UrbanBotTelegramType, 'urban-voice'>) {
        const metaToEdit = {
            chat_id: message.meta.chat.id,
            message_id: message.meta.message_id,
        } as const;
        const params = formatParamsForExistingMessage(message);
        const media = getTelegramMedia(message, 'parse_mode' in params ? params.parse_mode : undefined);

        if (media.type !== 'voice') {
            return;
        }

        const { chat_id, message_id } = metaToEdit;
        const options = { ...params, caption: message.data.title };

        try {
            await this.client.deleteMessage(chat_id, String(message_id));
            return await this.client.sendVoice(chat_id, message.data.file, options);
        } catch (e) {
            console.log('error', e);
        }
    }

    async editVideoNote(message: UrbanExistingMessageByType<UrbanBotTelegramType, 'urban-video-note'>) {
        const metaToEdit = {
            chat_id: message.meta.chat.id,
            message_id: message.meta.message_id,
        } as const;
        const params = formatParamsForExistingMessage(message);
        const media = getTelegramMedia(message, 'parse_mode' in params ? params.parse_mode : undefined);

        if (media.type !== 'video_note') {
            return;
        }

        const { chat_id, message_id } = metaToEdit;

        try {
            await this.client.deleteMessage(chat_id, String(message_id));
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            return await this.client.sendVideoNote(chat_id, message.data.file, params);
        } catch (e) {
            console.log('error', e);
        }
    }

    // FIXME this methods should be fixed in node-telegram-bot-api
    editMessageMedia(
        media: InputMedia | InputMediaAudio | InputMediaAnimation | InputMediaFile | InputVideoNote | InputVoice,
        options: EditMessageOptions,
        formData?: unknown,
    ) {
        const qs = { ...options, media: JSON.stringify(media) };
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.client._request('editMessageMedia', { qs, formData });
    }

    simulateTyping(chatId: string, simulateTyping?: number) {
        return new Promise<void>((resolve) => {
            if (typeof simulateTyping === 'number') {
                this.client.sendChatAction(chatId, 'typing').catch((e) => {
                    console.error('Error with simulate typing');
                    console.error(e);
                    resolve();
                });

                setTimeout(resolve, simulateTyping);
            } else {
                resolve();
            }
        });
    }
}
