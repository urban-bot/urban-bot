import NodeTelegramBot from 'node-telegram-bot-api';

function parseTextData(data) {
    const params = {
        parse_mode: data.parseMode,
        disable_web_page_preview: data.disableWebPagePreview,
        disable_notification: data.disableNotification,
        reply_to_message_id: data.replyToMessageId,
    };

    if (data.forceReply !== undefined || data.selective !== undefined) {
        const reply_markup = {
            force_reply: data.forceReply,
            selective: data.selective,
        };

        params.reply_markup = reply_markup;
    }

    if (data.buttons !== undefined) {
        params.reply_markup = params.reply_markup ?? {};
        params.reply_markup.inline_keyboard = [[]];

        data.buttons.forEach((button) => {
            // FIXME inline_keyboard can be matrix
            params.reply_markup.inline_keyboard[0].push({ text: button.text, callback_data: button.id });
        });
    }

    return params;
}

export class TelegramBot {
    constructor(token, options) {
        this.bot = new NodeTelegramBot(token, options);
    }

    on(event, listener) {
        let telegramEvent = event;
        if (event === 'action') {
            telegramEvent = 'callback_query';
        }

        return this.bot.on(telegramEvent, function(context) {
            if (telegramEvent === 'callback_query') {
                context.chat = context.message.chat;
                context.actionId = context.data;
            }
            listener(context);
        });
    }

    emit(type, message, metadata) {
        return this.bot.emit(type, message, metadata);
    }

    removeListener(eventName, listener) {
        return this.bot.removeListener(eventName, listener);
    }

    sendMessage(nodeName, chatId, data) {
        switch (nodeName) {
            case 'text': {
                const params = parseTextData(data);

                return this.bot.sendMessage(chatId, data.text, params);
            }
            case 'img': {
                return this.bot.sendPhoto(chatId, data.src, data);
            }
            case 'buttons': {
                const params = parseTextData(data);

                return this.bot.sendMessage(chatId, data.title, params);
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    updateMessage(nodeName, chatId, data, meta) {
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

                const media = {
                    type: 'photo',
                    media: data.src,
                    ...data,
                };

                this.bot.editMessageMedia(media, { ...media, ...metaToEdit });

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

    deleteMessage(nodeName, chatId, data, meta) {
        this.bot.deleteMessage(meta.chat.id, meta.message_id);
    }
}
