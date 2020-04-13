import NodeTelegramBot from 'node-telegram-bot-api';

export class TelegramBot {
    constructor(token, options) {
        this.bot = new NodeTelegramBot(token, options);
    }

    on(event, listener) {
        return this.bot.on(event, listener);
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

                return this.bot.sendMessage(chatId, data.text, params);
            }
            case 'img': {
                return this.bot.sendPhoto(chatId, data.src, data);
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

                this.bot.editMessageText(data.text, { ...data, ...metaToEdit });

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
