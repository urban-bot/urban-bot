import easyvk from 'easyvk';

function parseMessage(msg) {
    const peer_id = msg[3];
    const text = msg[5];
    return {
        out: msg[2] & 2,
        text,
        from: {},
        chat: {
            id: peer_id,
        },
    };
}

export class VkontakteBot {
    constructor(bot_token, _onLoad) {
        this.bot = easyvk({
            token: bot_token,
            reauth: true,
            utils: {
                longpoll: true,
            },
        })
            .then(async (vk) => {
                this.vk = vk;
                const connection = await vk.longpoll.connect();
                return {
                    vk,
                    connection,
                };
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async on(event, listener) {
        const bot = await this.bot;
        return bot.connection.on(event, (msg) => {
            let _msg = parseMessage(msg);
            if (_msg.out) {
                return;
            }

            return listener(_msg);
        });
    }

    emit(_type, _message, _metadata) {}

    removeListener(_eventName, _listener) {}

    async sendMessage(chatId, text, _form) {
        const bot = await this.bot;
        return bot.vk.call('messages.send', {
            peer_id: chatId,
            message: text,
            random_id: easyvk.randomId(),
        });
    }

    editMessageText(_text, _form) {}

    deleteMessage(_chatId, _messageId, _form) {}

    async sendPhoto(_chatId, _src, _params) {}

    editMessageMedia(_media, _form) {}
}
