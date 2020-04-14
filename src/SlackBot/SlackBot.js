const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

function adoptMessage(message) {
    // {
    //     client_msg_id: 'aff6917a-ddf5-4944-8ef2-5456d0aafd89',
    //         type: 'message',
    //         subtype?: 'edited',
    //     text: '123',
    //     user: 'U011ZBPDA84',
    //     ts: '1586877611.010700',
    //     team: 'T011ZBPDA3W',
    //     blocks: [ { type: 'rich_text', block_id: 'jOx', elements: [Array] } ],
    //     channel: 'C011ZBPDPSQ',
    //     event_ts: '1586877611.010700',
    //     channel_type: 'channel'
    // }

    return {
        text: message.text,
        from: {
            id: message.user,
        },
        chat: {
            id: message.channel,
        },
    };
}

export class SlackBot {
    constructor({ signingSecret, port = 8080, token }) {
        this.slackEvents = createEventAdapter(signingSecret);
        this.client = new WebClient(token);

        this.slackEvents.start(port);
    }

    on(event, listener) {
        return this.slackEvents.on(event, function(message) {
            if (message.bot_id !== undefined) {
                return;
            }

            if (event === 'message') {
                if (message.subtype) {
                    return;
                }
            }

            const data = adoptMessage(message);
            return listener(data);
        });
    }

    emit(type, message, metadata) {
        // return this.slackEvents.emit(type, message, metadata);
    }

    removeListener(eventName, listener) {
        return this.slackEvents.removeListener(eventName, listener);
    }

    sendMessage(nodeName, chatId, data) {
        switch (nodeName) {
            case 'text': {
                return this.client.chat.postMessage({ channel: chatId, text: data.text });
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with vk bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    updateMessage(nodeName, chatId, data, meta) {
        switch (nodeName) {
            case 'text': {
                this.client.chat.update({ channel: meta.channel, ts: meta.ts, text: data.text });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with telegram bot or add this logic to @urban-bot/telegram.`,
                );
            }
        }
    }

    deleteMessage(_nodeName, _chatId, _data, _meta) {}
}
