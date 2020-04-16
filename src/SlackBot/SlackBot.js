import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';
import { WebClient } from '@slack/web-api';
import express from 'express';
import bodyParser from 'body-parser';

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

function formatButtons(buttons) {
    return buttons.map((button) => {
        return {
            type: 'button',
            text: {
                type: 'plain_text',
                text: button.text,
                emoji: true,
            },
            value: button.id,
        };
    });
}

export class SlackBot {
    constructor({ signingSecret, port = 8080, token }) {
        this.client = new WebClient(token);

        this.events = createEventAdapter(signingSecret);
        this.interactions = createMessageAdapter(signingSecret);
        this.events.on('error', console.error);
        app.use('/slack/events', this.events.expressMiddleware());
        app.use('/slack/actions', this.interactions.expressMiddleware());

        app.post('/slack/commands', bodyParser.urlencoded({ extended: false }), this.handleCommand);
        this.events.on('message', this.handleMessage);
        this.interactions.action(/.*/, this.handleAction);

        app.listen(port, () => {
            console.log('start listen ' + port);
        });
    }

    // FIXME think about better implementation
    initializeProcessUpdate(processUpdate) {
        this.processUpdate = processUpdate;
    }

    processUpdate(_event, _data) {
        throw new Error('this method must be initialized via initializeProcessUpdate');
    }

    handleAction = (ctx) => {
        const adaptedCtx = {
            chat: ctx.channel,
            actionId: ctx.actions[0].value,
        };

        return this.processUpdate('action', adaptedCtx);
    };

    handleMessage = (ctx) => {
        if (ctx.bot_id !== undefined) {
            return;
        }

        if (ctx.subtype) {
            return;
        }

        const data = adaptMessage(ctx);

        return this.processUpdate('text', data);
    };

    handleCommand = (req, res) => {
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
        res.send();
        return this.processUpdate('command', ctx);
    };

    sendMessage(nodeName, chat, data) {
        switch (nodeName) {
            case 'text': {
                return this.client.chat.postMessage({
                    channel: chat.id,
                    text: data.text,
                });
            }
            case 'buttons': {
                const elements = formatButtons(data.buttons);

                const blocks = [];

                if (data.title !== undefined) {
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: data.title,
                        },
                    });
                }

                blocks.push({
                    type: 'actions',
                    elements,
                });

                return this.client.chat.postMessage({
                    channel: chat.id,
                    blocks,
                });
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    updateMessage(nodeName, chat, data, meta) {
        switch (nodeName) {
            case 'text': {
                this.client.chat.update({ channel: meta.channel, ts: meta.ts, text: data.text });

                break;
            }
            case 'buttons': {
                const elements = formatButtons(data.buttons);

                const blocks = [];

                if (data.title !== undefined) {
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: data.title,
                        },
                    });
                }

                blocks.push({
                    type: 'actions',
                    elements,
                });

                this.client.chat.update({
                    channel: meta.channel,
                    ts: meta.ts,
                    blocks,
                });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${nodeName}' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    deleteMessage(nodeName, chat, data, meta) {
        this.client.chat.delete({ channel: meta.channel, ts: meta.ts });
    }
}
