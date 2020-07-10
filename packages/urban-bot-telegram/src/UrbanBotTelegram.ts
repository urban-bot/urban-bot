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
    UrbanBot,
    UrbanExistingMessage,
    UrbanMessage,
    UrbanCommand,
    UrbanParseMode,
    UrbanExistingMessageByType,
} from '@urban-bot/core';
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
    InputMediaAnimation,
} from './types';
import express from 'express';

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
    [key: string]: any;
};

export class UrbanBotTelegram implements UrbanBot<UrbanBotTelegramType> {
    static TYPE = 'TELEGRAM' as const;
    type = UrbanBotTelegram.TYPE;
    defaultParseMode: UrbanParseMode = 'HTML';

    client: TelegramBot;

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
        this.client.on('message', (ctx) => {
            const ctxWithDice: TelegramBotMessage = ctx;

            if (ctxWithDice.dice !== undefined) {
                this.handleMessage('dice', ctxWithDice);

                return;
            }
        });
    }

    initializeServer(expressApp: express.Express) {
        if (this.options.isPolling) {
            return;
        }

        expressApp.use('/telegram/*', express.json());
        expressApp.post(`/telegram/bot${this.options.token}`, (req, res) => {
            this.client.processUpdate(req.body);
            res.sendStatus(200);
        });
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanBotTelegramType>) {
        throw new Error('this method must be overridden');
    }

    handleMessage = (type: UrbanSyntheticEventType<UrbanBotTelegramType>, ctx: TelegramBotMessage) => {
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
                if (ctx.text === undefined) {
                    break;
                }

                if (ctx.text[0] === '/') {
                    const [command, ...args] = ctx.text.split(' ');
                    const adaptedContext: UrbanSyntheticEventCommand<UrbanBotTelegramType> = {
                        ...common,
                        type: 'command',
                        payload: {
                            command,
                            argument: args.join(' '),
                        },
                    };

                    this.processUpdate(adaptedContext);
                } else {
                    const adaptedContext: UrbanSyntheticEventText<UrbanBotTelegramType> = {
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
                const adaptedContext: UrbanSyntheticEventDice<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventPoll<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventSticker<UrbanBotTelegramType> = {
                    ...common,
                    type: 'sticker',
                    payload: {
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
                if (ctx.animation === undefined) {
                    break;
                }

                const adaptedContext: UrbanSyntheticEventAnimation<UrbanBotTelegramType> = {
                    ...common,
                    type: 'animation',
                    payload: {
                        duration: ctx.animation.duration,
                        name: ctx.animation.file_name,
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
                const adaptedContext: UrbanSyntheticEventAudio<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventContact<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventFile<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventInvoice<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventLocation<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventImage<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventVideo<UrbanBotTelegramType> = {
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

                const adaptedContext: UrbanSyntheticEventVoice<UrbanBotTelegramType> = {
                    ...common,
                    type: 'voice',
                    payload: {
                        duration: ctx.voice.duration,
                        mimeType: ctx.voice.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);

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
        await this.simulateTyping(message.chat.id, message.data.typing);

        switch (message.nodeName) {
            case 'urban-text': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendMessage(message.chat.id, message.data.text, params);
            }
            case 'urban-img': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendPhoto(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });
            }
            case 'urban-buttons': {
                const params = formatParamsForNewMessage(message);

                if (!message.data.title) {
                    throw new Error('@urban-bot/telegram Specify title prop to ButtonGroup');
                }

                return this.client.sendMessage(message.chat.id, message.data.title, params);
            }
            case 'urban-audio': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendAudio(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    performer: message.data.author,
                    title: message.data.name,
                });
            }
            case 'urban-video': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendVideo(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                    duration: message.data.duration,
                    width: message.data.width,
                    height: message.data.height,
                });
            }
            case 'urban-animation': {
                const params = formatParamsForNewMessage(message);

                return (
                    this.client
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore @types/node-telegram-bot-api bug. Doesn't have sendAnimation type
                        .sendAnimation(message.chat.id, message.data.file, {
                            ...params,
                            file_name: message.data.name,
                            caption: message.data.title,
                            duration: message.data.duration,
                            width: message.data.width,
                            height: message.data.height,
                        })
                );
            }
            case 'urban-file': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendDocument(message.chat.id, message.data.file, {
                    ...params,
                    caption: message.data.title,
                });
            }
            case 'urban-location': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendLocation(message.chat.id, message.data.latitude, message.data.longitude, {
                    ...params,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore @types/node-telegram-bot-api bug. live_period is existed
                    live_period: message.data.livePeriodSeconds,
                });
            }
            case 'urban-media': {
                const params = formatParamsForNewMessage(message);

                const media = message.data.files.map((fileData) => {
                    const { type, file, title, ...other } = fileData;
                    const common = {
                        media: file,
                        parse_mode: message.data.parseMode,
                        caption: title,
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
                return this.client.sendMediaGroup(message.chat.id, media, params);
            }
            case 'urban-contact': {
                const params = formatParamsForNewMessage(message);

                return this.client.sendContact(
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
            }
            case 'urban-poll': {
                const params = formatParamsForNewMessage(message);
                const options = message.data.options.map(({ text }) => text);

                return (
                    this.client
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore @types/node-telegram-bot-api bug. Doesn't have sendPoll type
                        .sendPoll(message.chat.id, message.data.question, options, {
                            ...params,
                            is_anonymous: message.data.isAnonymous,
                            type: message.data.type,
                            allows_multiple_answers: message.data.withMultipleAnswers,
                            correct_option_id: message.data.rightOption,
                            explanation: message.data.explanation,
                            explanation_parse_mode: params.parse_mode,
                            open_period: message.data.livePeriodSeconds,
                            close_date: message.data.close_time,
                        })
                );
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
            case 'urban-video': {
                this.editMedia(message);

                break;
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
        this.client.deleteMessage(message.meta.chat.id, String(message.meta.message_id));
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

    // FIXME this methods should be fixed in node-telegram-bot-api
    editMessageMedia(
        media: TelegramBot.InputMedia | InputMediaAudio | InputMediaAnimation | InputMediaFile,
        options: EditMessageOptions,
        formData?: unknown,
    ) {
        const qs = { ...options, media: JSON.stringify(media) };
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.client._request('editMessageMedia', { qs, formData });
    }

    simulateTyping(chatId: string, typing?: number) {
        return new Promise((resolve) => {
            if (typeof typing === 'number') {
                this.client.sendChatAction(chatId, 'typing').catch((e) => {
                    console.error('Error with simulate typing');
                    console.error(e);
                    resolve();
                });

                setTimeout(resolve, typing);
            } else {
                resolve();
            }
        });
    }
}
