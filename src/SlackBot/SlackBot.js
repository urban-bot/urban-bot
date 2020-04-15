import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';
import express from 'express';
import bodyParser from 'body-parser';
import EventEmitter from 'events';

const app = express();

function adaptMessage(message) {
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

export class SlackBot extends EventEmitter {
    constructor({ signingSecret, port = 8080, token }) {
        super();
        this.client = new WebClient(token);

        this.slackEvents = createEventAdapter(signingSecret);
        this.slackEvents.on('error', console.error);
        app.use('/slack/events', this.slackEvents.expressMiddleware());

        app.post('/slack/commands', bodyParser.urlencoded({ extended: false }), this.handleCommand);
        this.slackEvents.on('message', this.handleMessage);

        app.listen(port, () => {
            console.log('start listen ' + port);
        });
    }

    handleMessage = (ctx) => {
        if (ctx.bot_id !== undefined) {
            return;
        }

        if (ctx.subtype) {
            return;
        }

        const data = adaptMessage(ctx);

        return super.emit('message', data);
    };

    handleCommand = (req, res, next) => {
        const { channel_id, command, text, user_id, user_name } = req.body;
        const ctx = {
            chat: {
                id: channel_id,
            },
            from: {
                id: user_id,
                username: user_name,
            },
            command,
            text,
        };
        super.emit('command', ctx);
        res.send();
        next();
    };

    on(event, listener, eventId) {
        // console.log('on', event, eventId);
        return super.on(event, listener);
    };

    emit(_type, _message, _metadata) {
        // return this.slackEvents.emit(type, message, metadata);
    };

    removeListener(event, listener, eventId) {
        // console.log('removeListener', event, eventId);
        console.log('listenerCount', super.listenerCount('message'));
        return super.removeListener(event, listener);
    };

    sendMessage(nodeName, chatId, data) {
        switch (nodeName) {
            case 'text': {
                return this.client.chat.postMessage({ channel: chatId, text: data.text });
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
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
                    `Tag '${nodeName}' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    deleteMessage(nodeName, chatId, data, meta) {
        switch (nodeName) {
            case 'text': {
                this.client.chat.delete({ channel: meta.channel, ts: meta.ts });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }
}
