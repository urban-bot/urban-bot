import easyvk from 'easyvk';

function parseMessage(msg) {
    // return {
    //     out: msg[2] & 2,
    //     peer_id: msg[3],
    //     text: msg[5],
    //     payload: msg[6].payload,
    // };
    const peer_id = msg[3];
    const text = msg[5];

    return {
        text,
        from: {},
        chat: {
            id: peer_id,
        },
    };
}

export class VkontakteBot {
    constructor(token, onLoad) {
        this.bot = easyvk({
            token,
            utils: {
                longpoll: true,
            },
        }).then(async (vk) => {
            this.vk = vk;
            const connection = await vk.longpoll.connect();
            return {
                vk,
                connection,
            };
        });
    }

    async on(event, listener) {
        const bot = await this.bot;
        return bot.connection.on(event, (msg) => {
            let _msg = parseMessage(msg);
            return listener(_msg);
        });
    }

    emit(type, message, metadata) {
        //   return this.bot.emit(type, message, metadata);
    }

    removeListener(eventName, listener) {
        // return this.bot.removeListener(eventName, listener);
    }

    async sendMessage(chatId, text, form) {
        const bot = await this.bot;
        return bot.vk.call('messages.send', {
            peer_id: chatId,
            message: text,
            random_id: easyvk.randomId(),
        });
    }

    editMessageText(text, form) {
        // return this.bot.editMessageText(text, form);
    }

    deleteMessage(chatId, messageId, form) {
        // return this.bot.deleteMessage(chatId, messageId, form);
    }

    async sendPhoto(chatId, src, params) {
        // return this.bot.sendPhoto(chatId, src, params);
    }

    editMessageMedia(media, form) {
        // return this.bot.editMessageMedia(media, form);
    }
}
