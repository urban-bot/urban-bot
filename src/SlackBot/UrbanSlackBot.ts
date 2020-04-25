/* eslint-disable @typescript-eslint/camelcase */
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';
import { WebClient } from '@slack/web-api';
import express from 'express';
import bodyParser from 'body-parser';
import { UrbanBot } from '../types/UrbanBot';
import { SlackMessageAdapter } from '@slack/interactive-messages/dist/adapter';
import { KnownBlock } from '@slack/types';
import SlackEventAdapter from '@slack/events-api/dist/adapter';
import { UrbanEvent, UrbanEventAction, UrbanEventCommand, UrbanEventCommon, UrbanEventText } from '../types/Events';
import { UrbanMessage, UrbanExistingMessage, UrbanMessageImageData } from '../types/Messages';
import {
    SlackActionContext,
    SlackMessageContext,
    SlackPayload,
    SlackCommandContext,
    SlackMessageMeta,
    SLACK,
} from './types';
import { formatButtons, formatTitle } from './format';
import { UrbanFile } from '../types';

const app = express();

type UrbanSlackBotProps = {
    signingSecret: string;
    token: string;
    port?: number;
};

export class UrbanSlackBot implements UrbanBot<SLACK, SlackPayload, SlackMessageMeta> {
    static TYPE = 'SLACK' as const;
    type = UrbanSlackBot.TYPE;
    client: WebClient;
    events: SlackEventAdapter;
    interactions: SlackMessageAdapter;
    publicUrlMap: Map<Buffer | NodeJS.ReadableStream, string> = new Map();

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

        app.listen(port);
    }

    processUpdate(_event: UrbanEvent<SLACK, SlackPayload>) {
        throw new Error('this method must be overridden');
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

        const common: UrbanEventCommon<SLACK, SlackMessageContext> = {
            chat: {
                id: ctx.channel,
            },
            from: {
                id: ctx.user,
            },
            nativeEvent: {
                type: UrbanSlackBot.TYPE,
                payload: ctx,
            },
        };

        if (ctx.files !== undefined) {
            const files: UrbanFile[] = ctx.files.map((file) => {
                return {
                    mimeType: file.mimetype,
                    width: file.original_w,
                    height: file.original_h,
                    id: file.id,
                    size: file.size,
                    name: file.name,
                };
            });

            const fileEvent = {
                ...common,
                payload: {
                    text: ctx.text,
                    files,
                },
            } as const;
            const isAllImages = files.every(({ mimeType }) => mimeType?.split('/')[0] === 'image');
            const isAllVideo = files.every(({ mimeType }) => mimeType?.split('/')[0] === 'video');
            const isAllAudio = files.every(({ mimeType }) => mimeType?.split('/')[0] === 'audio');

            if (isAllImages) {
                this.processUpdate({
                    type: 'image',
                    ...fileEvent,
                });
            } else if (isAllVideo) {
                this.processUpdate({
                    type: 'video',
                    ...fileEvent,
                });
            } else if (isAllAudio) {
                this.processUpdate({
                    type: 'audio',
                    ...fileEvent,
                });
            }

            this.processUpdate({
                ...fileEvent,
                type: 'file',
            });

            return;
        }

        if (ctx.subtype) {
            return;
        }

        const textEvent: UrbanEventText<SLACK, SlackMessageContext> = {
            ...common,
            type: 'text',
            payload: {
                text: ctx.text,
            },
        };

        return this.processUpdate(textEvent);
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

    async sendMessage(message: UrbanMessage): Promise<SlackMessageMeta> {
        switch (message.nodeName) {
            case 'urban-text': {
                return (this.client.chat.postMessage({
                    channel: message.chat.id,
                    text: message.data.text,
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            case 'urban-img': {
                const image_url = await this.getImageUrl(message.data);

                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title ?? '',
                            emoji: true,
                        },
                        image_url,
                        alt_text: message.data.alt ?? '',
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
                    text: message.data.title ?? '',
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            case 'urban-buttons': {
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
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    async updateMessage(message: UrbanExistingMessage<SlackMessageMeta>) {
        switch (message.nodeName) {
            case 'urban-text': {
                this.client.chat.update({
                    channel: message.meta.channel,
                    ts: message.meta.ts,
                    text: message.data.text,
                });

                break;
            }
            case 'urban-img': {
                const image_url = await this.getImageUrl(message.data);

                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title ?? '',
                            emoji: true,
                        },
                        image_url,
                        alt_text: message.data.alt ?? '',
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
                    text: message.data.title ?? '', // TODO: investigate me
                });

                break;
            }
            case 'urban-buttons': {
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' does not exist. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
                );
            }
        }
    }

    deleteMessage(message: UrbanExistingMessage<SlackMessageMeta>) {
        this.client.chat.delete({ channel: message.meta.channel, ts: message.meta.ts });
    }

    async getImageUrl(messageData: UrbanMessageImageData): Promise<string> {
        if (typeof messageData.image !== 'string') {
            const savedPublicUrl = this.publicUrlMap.get(messageData.image);
            if (savedPublicUrl !== undefined) {
                return savedPublicUrl;
            }

            // TODO describe types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const uploadRes: any = await this.client.files.upload({
                file: messageData.image,
                filename: messageData.filename,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sharedPublicURLRes: any = await this.client.files.sharedPublicURL({
                file: uploadRes.file.id,
            });

            const parsedPermalink = sharedPublicURLRes.file.permalink_public.split('-');
            const pubSecret = parsedPermalink[parsedPermalink.length - 1];

            const publicUrl = sharedPublicURLRes.file.url_private + `?pub_secret=${pubSecret}`;

            this.publicUrlMap.set(messageData.image, publicUrl);

            return publicUrl;
        } else {
            return messageData.image;
        }
    }
}
