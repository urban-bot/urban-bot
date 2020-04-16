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
            const _msg = parseMessage(msg);

            if (_msg.out) {
                return;
            }

            return listener(_msg);
        });
    }

    emit(_type, _message, _metadata) {}

    removeListener(_eventName, _listener) {}

    async sendMessage(nodeName, chat, data) {
        const bot = await this.bot;

        switch (nodeName) {
            case 'text': {
                return bot.vk.call('messages.send', {
                    peer_id: chat.id,
                    message: data.text,
                    random_id: easyvk.randomId(),
                });
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with vk bot or add this logic to @urban-bot/vk.`,
                );
            }
        }
    }

    updateMessage(_nodeName, _chat, _data, _meta) {}

    deleteMessage(_nodeName, _chat, _data, _meta) {}
}
