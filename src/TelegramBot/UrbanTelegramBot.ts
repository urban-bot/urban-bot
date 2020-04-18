/* eslint-disable @typescript-eslint/camelcase */
import TelegramBot from 'node-telegram-bot-api';
import {
    UrbanEvent,
    UrbanEventVoice,
    UrbanEventText,
    UrbanEventDice,
    UrbanEventVideo,
    UrbanEventPoll,
    UrbanEventPhoto,
    UrbanEventLocation,
    UrbanEventInvoice,
    UrbanEventCommand,
    UrbanEventSticker,
    UrbanEventDocument,
    UrbanEventContact,
    UrbanEventAudio,
    UrbanEventAnimation,
    UrbanEventAction,
    EventType,
} from '../types/Events';
import { UrbanBot } from '../types/UrbanBotType';
type TELEGRAM = 'TELEGRAM';

type ParseTextDataPropType = {
    parseMode: 'HTML' | 'MarkdownV2' | undefined;

    disableWebPagePreview: unknown;
    disableNotification: unknown;
    replyToMessageId: unknown;

    forceReply: unknown;
    selective: unknown;

    buttons: { text: unknown; id: unknown }[];
};

function parseTextData(data: ParseTextDataPropType): TelegramBot.SendMessageOptions {
    let parse_mode: 'HTML' | 'MarkdownV2' | undefined;

    if (data.parseMode !== undefined) {
        parse_mode = data.parseMode === 'HTML' ? 'HTML' : 'MarkdownV2';
    }

    const params: any = {
        parse_mode,
        disable_web_page_preview: data.disableWebPagePreview,
        disable_notification: data.disableNotification,
        reply_to_message_id: data.replyToMessageId,
    };

    if (data.forceReply !== undefined || data.selective !== undefined) {
        params.reply_markup = {
            force_reply: data.forceReply,
            selective: data.selective,
        };
    }

    if (data.buttons !== undefined) {
        // FIXME inline_keyboard can be matrix
        const inlineKeyboard = data.buttons.map(({ text, id }) => {
            return { text, callback_data: id };
        });
        params.reply_markup = params.reply_markup ?? {};
        params.reply_markup.inline_keyboard = [inlineKeyboard];
    }

    return params;
}
type ProcessUpdate<Type, NativeEventPayload> = (event: UrbanEvent<Type, NativeEventPayload>) => void;

type TelegramPayloads = TelegramBot.Message | TelegramBot.CallbackQuery;

type TelegramBotLostMessage = {
    dice?: {
        value: number;
    };
};
type TelegramBotMessage = TelegramBot.Message & TelegramBotLostMessage;

export class UrbanTelegramBot implements UrbanBot<TELEGRAM, TelegramPayloads> {
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
        this.bot.on('document', (ctx) => this.handleMessage('document', ctx));
        this.bot.on('invoice', (ctx) => this.handleMessage('invoice', ctx));
        this.bot.on('location', (ctx) => this.handleMessage('location', ctx));
        this.bot.on('photo', (ctx) => this.handleMessage('photo', ctx));
        this.bot.on('poll' as any, (ctx) => this.handleMessage('poll', (ctx as unknown) as TelegramBot.Message));
        this.bot.on('video', (ctx) => this.handleMessage('video', ctx));
        this.bot.on('voice', (ctx) => this.handleMessage('voice', ctx));
        this.bot.on('message', (ctx) => {
            const fixTypes: TelegramBotMessage = ctx;

            if (fixTypes.dice !== undefined) {
                this.handleMessage('dice', fixTypes);

                return;
            }
        });
    }

    // FIXME think about better implementation
    initializeProcessUpdate(processUpdate: ProcessUpdate<TELEGRAM, TelegramPayloads>) {
        this.processUpdate = processUpdate;
    }

    processUpdate(_event: UrbanEvent<TELEGRAM, TelegramPayloads>) {
        throw new Error('this method must be initialized via initializeProcessUpdate');
    }

    handleMessage = (type: EventType<TELEGRAM, TelegramPayloads>, ctx: TelegramBotMessage) => {
        const common = {
            chat: {
                id: String(ctx.chat.id),
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
                    const adaptedContext: UrbanEventText<TELEGRAM, TelegramBot.Message> = {
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
                const adaptedContext: UrbanEventDice<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventPoll<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventSticker<TELEGRAM, TelegramBot.Message> = {
                    ...common,
                    type: 'sticker',
                    payload: {
                        emoji: ctx.sticker.emoji,
                        id: ctx.sticker.file_id,
                        size: ctx.sticker.file_size,
                        width: ctx.sticker.width,
                        height: ctx.sticker.width,
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

                const adaptedContext: UrbanEventAnimation<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventAudio<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventContact<TELEGRAM, TelegramBot.Message> = {
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
            case 'document': {
                if (ctx.document === undefined) {
                    break;
                }

                const adaptedContext: UrbanEventDocument<TELEGRAM, TelegramBot.Message> = {
                    ...common,
                    type: 'document',
                    payload: {
                        fileName: ctx.document.file_name,
                        fileSize: ctx.document.file_size,
                        mimeType: ctx.document.mime_type,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'invoice': {
                if (ctx.invoice === undefined) {
                    break;
                }

                const adaptedContext: UrbanEventInvoice<TELEGRAM, TelegramBot.Message> = {
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

                const adaptedContext: UrbanEventLocation<TELEGRAM, TelegramBot.Message> = {
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
            case 'photo': {
                if (ctx.photo === undefined) {
                    break;
                }

                const adaptedContext: UrbanEventPhoto<TELEGRAM, TelegramBot.Message> = {
                    ...common,
                    type: 'photo',
                    payload: {
                        fileIds: ctx.photo.map((photo) => photo.file_id),
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
                        duration: ctx.video.duration,
                        fileId: ctx.video.file_id,
                        fileSize: ctx.video.file_size,
                    },
                };

                this.processUpdate(adaptedContext);
                break;
            }
            case 'voice': {
                if (ctx.voice === undefined) {
                    break;
                }

                const adaptedContext: UrbanEventVoice<TELEGRAM, TelegramBot.Message> = {
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

    sendMessage(nodeName: any, chat: any, data: any) {
        switch (nodeName) {
            case 'text': {
                const params = parseTextData(data);

                return this.bot.sendMessage(chat.id, data.text, params);
            }
            case 'img': {
                const params = parseTextData(data);

                return this.bot.sendPhoto(chat.id, data.src, { ...params, caption: data.title } as any);
            }
            case 'buttons': {
                const params = parseTextData(data);

                return this.bot.sendMessage(chat.id, data.title, params);
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    updateMessage(nodeName: any, _chat: any, data: any, meta: any) {
        switch (nodeName) {
            case 'text': {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = parseTextData(data);

                this.bot.editMessageText(data.text, { ...params, ...metaToEdit } as any);

                break;
            }
            case 'img': {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = parseTextData(data);

                const media = {
                    type: 'photo',
                    media: data.src,
                    caption: data.title,
                    parse_mode: params.parse_mode,
                };

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                this.bot.editMessageMedia(media, { ...params, ...metaToEdit });

                break;
            }
            case 'buttons': {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = parseTextData(data);

                this.bot.editMessageText(data.title, { ...params, ...metaToEdit } as any);

                break;
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    deleteMessage(_nodeName: any, _chat: any, _data: any, _meta: any) {
        this.bot.deleteMessage(_meta.chat.id, _meta.message_id);
    }
}
