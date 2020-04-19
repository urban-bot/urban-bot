/* eslint-disable @typescript-eslint/camelcase */
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';
import { WebClient } from '@slack/web-api';
import express from 'express';
import bodyParser from 'body-parser';
import { UrbanBot, ProcessUpdate } from '../types/UrbanBot';
import { SlackMessageAdapter } from '@slack/interactive-messages/dist/adapter';
import { KnownBlock, Button, SectionBlock } from '@slack/types';
import SlackEventAdapter from '@slack/events-api/dist/adapter';
import { UrbanEvent, UrbanEventAction, UrbanEventCommand } from '../types/Events';
import { UrbanNewMessage, UrbanExistingMessage, UrbanButton } from '../types/Messages';
import { SlackActionContext, SlackMessageContext, SlackPayload, SlackCommandContext } from './types';

type SLACK = 'SLACK';
const app = express();
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

function adaptMessage(message: SlackMessageContext): UrbanEvent<SLACK, SlackPayload> {
    return {
        type: 'text',
        chat: {
            id: message.channel,
        },
        from: {
            id: message.user,
        },
        payload: {
            text: message.text,
        },
        nativeEvent: {
            type: 'SLACK',
            payload: message,
        },
    };
}

function formatButtons(buttons: UrbanButton[]): Button[] {
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

function formatTitle(title: string): SectionBlock {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: title,
        },
    };
}

type UrbanSlackBotProps = {
    signingSecret: string;
    token: string;
    port: number;
};

export class UrbanSlackBot implements UrbanBot<SLACK, SlackPayload, SlackMessageContext> {
    static TYPE = 'SLACK' as const;
    type = UrbanSlackBot.TYPE;
    client: WebClient;
    events: SlackEventAdapter;
    interactions: SlackMessageAdapter;

    constructor({ signingSecret, port = 8080, token }: UrbanSlackBotProps) {
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
    initializeProcessUpdate(processUpdate: ProcessUpdate<SLACK, SlackPayload>) {
        this.processUpdate = processUpdate;
    }

    processUpdate(_event: UrbanEvent<SLACK, SlackPayload>) {
        throw new Error('this method must be initialized via initializeProcessUpdate');
    }

    handleAction = (ctx: SlackActionContext) => {
        if (ctx.actions.length > 0 && ctx.actions[0].type === 'button') {
            if (ctx.actions[0].value === undefined) {
                return;
            }

            const adaptedCtx: UrbanEventAction<SLACK, SlackPayload> = {
                type: 'action',
                chat: {
                    id: ctx.channel.id,
                },
                from: {
                    id: ctx.user.id,
                    username: ctx.user.username,
                },
                payload: {
                    actionId: ctx.actions[0].value,
                },
                nativeEvent: {
                    type: UrbanSlackBot.TYPE,
                    payload: ctx,
                },
            };

            this.processUpdate(adaptedCtx);
        }
    };

    handleMessage = (ctx: SlackMessageContext) => {
        if (ctx.bot_id !== undefined) {
            return;
        }

        if (ctx.subtype) {
            return;
        }

        const data = adaptMessage(ctx);

        return this.processUpdate(data);
    };

    handleCommand = (req: express.Request, res: express.Response) => {
        const { channel_id, command, text, user_id, user_name } = req.body as SlackCommandContext;
        const ctx: UrbanEventCommand<SLACK, SlackCommandContext> = {
            type: 'command',
            chat: {
                id: channel_id,
            },
            payload: {
                command,
                text,
            },
            from: {
                id: user_id,
                username: user_name,
            },
            nativeEvent: {
                type: UrbanSlackBot.TYPE,
                payload: req.body,
            },
        };
        res.send();
        return this.processUpdate(ctx);
    };

    sendMessage(message: UrbanNewMessage): Promise<SlackMessageContext> {
        switch (message.nodeName) {
            case 'text': {
                return (this.client.chat.postMessage({
                    channel: message.chat.id,
                    text: message.data.text,
                }) as unknown) as Promise<SlackMessageContext>; // TODO: investigate me
            }
            case 'img': {
                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title,
                            emoji: true,
                        },
                        image_url: message.data.src,
                        alt_text: message.data.altText,
                    },
                ];

                if (message.data.buttons !== undefined) {
                    blocks.push({
                        type: 'actions',
                        elements: formatButtons(message.data.buttons),
                    });
                }

                return (this.client.chat.postMessage({
                    channel: message.chat.id,
                    blocks,
                    text: message.data.title,
                }) as unknown) as Promise<SlackMessageContext>; // TODO: investigate me;
            }
            case 'buttons': {
                const elements = formatButtons(message.data.buttons);

                const blocks: KnownBlock[] = [];

                if (message.data.title !== undefined) {
                    blocks.push(formatTitle(message.data.title));
                }

                blocks.push({
                    type: 'actions',
                    elements,
                });

                return (this.client.chat.postMessage({
                    channel: message.chat.id,
                    blocks,
                    text: message.data.title,
                }) as unknown) as Promise<SlackMessageContext>; // TODO: investigate me;
            }
            default: {
                throw new Error(
                    `Tag '${
                        (message as any).nodeName
                    }' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    updateMessage(message: UrbanExistingMessage<SlackMessageContext>) {
        switch (message.nodeName) {
            case 'text': {
                this.client.chat.update({
                    channel: message.meta.channel,
                    ts: message.meta.ts,
                    text: message.data.text,
                });

                break;
            }
            case 'img': {
                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title,
                            emoji: true,
                        },
                        image_url: message.data.src,
                        alt_text: message.data.altText,
                    },
                ];

                if (message.data.buttons !== undefined) {
                    blocks.push({
                        type: 'actions',
                        elements: formatButtons(message.data.buttons),
                    });
                }

                this.client.chat.update({
                    channel: message.meta.channel,
                    ts: message.meta.ts,
                    blocks,
                    text: message.data.title, // TODO: investigate me
                });

                break;
            }
            case 'buttons': {
                const elements = formatButtons(message.data.buttons);

                const blocks: KnownBlock[] = [];

                if (message.data.title !== undefined) {
                    blocks.push(formatTitle(message.data.title));
                }

                blocks.push({
                    type: 'actions',
                    elements,
                });

                this.client.chat.update({
                    channel: message.meta.channel,
                    ts: message.meta.ts,
                    blocks,
                    text: message.data.title,
                });

                break;
            }
            default: {
                throw new Error(
                    `Tag '${
                        (message as any).nodeName
                    }' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    deleteMessage(message: UrbanExistingMessage<SlackMessageContext>) {
        this.client.chat.delete({ channel: message.meta.channel, ts: message.meta.ts });
    }
}
