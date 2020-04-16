import NodeTelegramBot from 'node-telegram-bot-api';

function parseTextData(data) {
    const params = {
        parse_mode: data.parseMode,
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

export class TelegramBot {
    static TYPE = 'TELEGRAM';
    type = TelegramBot.TYPE;

    constructor(token, options) {
        this.bot = new NodeTelegramBot(token, options);

        this.bot.on('text', this.handleText);
        this.bot.on('callback_query', this.handleCallbackQuery);
        this.bot.on('sticker', (ctx) => this.processUpdate('sticker', ctx));
        this.bot.on('animation', (ctx) => this.processUpdate('animation', ctx));
        this.bot.on('audio', (ctx) => this.processUpdate('audio', ctx));
        this.bot.on('contact', (ctx) => this.processUpdate('contact', ctx));
        this.bot.on('document', (ctx) => this.processUpdate('document', ctx));
        this.bot.on('invoice', (ctx) => this.processUpdate('invoice', ctx));
        this.bot.on('location', (ctx) => this.processUpdate('location', ctx));
        this.bot.on('photo', (ctx) => this.processUpdate('photo', ctx));
        this.bot.on('poll', (ctx) => this.processUpdate('poll', ctx));
        this.bot.on('video', (ctx) => this.processUpdate('video', ctx));
        this.bot.on('voice', (ctx) => this.processUpdate('voice', ctx));
        this.bot.on('message', this.handleMessage);
    }

    // FIXME think about better implementation
    initializeProcessUpdate(processUpdate) {
        this.processUpdate = processUpdate;
    }

    processUpdate() {
        throw new Error('this method must be initialized via initializeProcessUpdate');
    }

    handleMessage = (ctx) => {
        if (ctx.dice) {
            return this.processUpdate('dice', ctx);
        }
    };

    handleCallbackQuery = (ctx) => {
        ctx.chat = ctx.message.chat;
        ctx.actionId = ctx.data;

        return this.processUpdate('action', ctx);
    };

    handleText = (ctx) => {
        if (ctx.text[0] === '/') {
            ctx.command = ctx.text;

            return this.processUpdate('command', ctx);
        } else {
            return this.processUpdate('text', ctx);
        }
    };

    sendMessage(nodeName, chat, data) {
        switch (nodeName) {
            case 'text': {
                const params = parseTextData(data);

                return this.bot.sendMessage(chat.id, data.text, params);
            }
            case 'img': {
                const params = parseTextData(data);

                return this.bot.sendPhoto(chat.id, data.src, { ...params, caption: data.title });
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

    updateMessage(nodeName, chat, data, meta) {
        switch (nodeName) {
            case 'text': {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = parseTextData(data);

                this.bot.editMessageText(data.text, { ...params, ...metaToEdit });

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

                this.bot.editMessageMedia(media, { ...params, ...metaToEdit });

                break;
            }
            case 'buttons': {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = parseTextData(data);

                this.bot.editMessageText(data.title, { ...params, ...metaToEdit });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    deleteMessage(nodeName, chat, data, meta) {
        this.bot.deleteMessage(meta.chat.id, meta.message_id);
    }
}
