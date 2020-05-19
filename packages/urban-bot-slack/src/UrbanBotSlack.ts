/* eslint-disable @typescript-eslint/camelcase */
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';
import { WebClient } from '@slack/web-api';
import express from 'express';
import bodyParser from 'body-parser';
import {
    UrbanBot,
    UrbanMessage,
    UrbanExistingMessage,
    UrbanSyntheticEvent,
    UrbanSyntheticEventAction,
    UrbanSyntheticEventCommand,
    UrbanSyntheticEventCommon,
    UrbanSyntheticEventText,
    UrbanParseMode,
} from '@urban-bot/core';
import { KnownBlock } from '@slack/types';

import {
    SlackActionContext,
    SlackMessageContext,
    SlackPayload,
    SlackCommandContext,
    SlackMessageMeta,
    SLACK,
} from './types';
import { formatButtons, formatTitle, withRightSpaceIfExist } from './format';
import { getTypeByMimeType } from './utils';

const app = express();

export type UrbanBotSlackProps = {
    signingSecret: string;
    token: string;
    port?: number;
};

export type UrbanNativeEventSlack = {
    type: SLACK;
    payload?: SlackPayload;
};

export type SlackBotMeta = {
    NativeEvent: UrbanNativeEventSlack;
    MessageMeta: SlackMessageMeta;
};

export class UrbanBotSlack implements UrbanBot<SlackBotMeta> {
    static TYPE = 'SLACK' as const;
    type = UrbanBotSlack.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    client: WebClient;
    events: ReturnType<typeof createEventAdapter>;
    interactions: ReturnType<typeof createMessageAdapter>;

    constructor({ signingSecret, port = 8080, token }: UrbanBotSlackProps) {
        this.client = new WebClient(token);

        this.events = createEventAdapter(signingSecret);
        this.interactions = createMessageAdapter(signingSecret);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore this.events extends EventEmitter
        this.events.on('error', console.error);
        app.use('/slack/events', this.events.expressMiddleware());
        app.use('/slack/actions', this.interactions.expressMiddleware());

        app.post('/slack/commands', bodyParser.urlencoded({ extended: false }), this.handleCommand);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore this.events extends EventEmitter
        this.events.on('message', this.handleMessage);
        this.interactions.action(/.*/, this.handleAction);

        app.listen(port, () => {
            console.log('@urban-bot/slack has started');
        });
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanNativeEventSlack>) {
        throw new Error('this method must be overridden');
    }

    handleAction = (ctx: SlackActionContext) => {
        if (ctx.actions.length > 0 && ctx.actions[0].type === 'button') {
            if (ctx.actions[0].value === undefined) {
                return;
            }

            const adaptedCtx: UrbanSyntheticEventAction<UrbanNativeEventSlack> = {
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
                    type: UrbanBotSlack.TYPE,
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

        const common: UrbanSyntheticEventCommon<UrbanNativeEventSlack> = {
            chat: {
                id: ctx.channel,
                type: ctx.channel_type,
            },
            from: {
                id: ctx.user,
            },
            nativeEvent: {
                type: UrbanBotSlack.TYPE,
                payload: ctx,
            },
        };

        if (ctx.files !== undefined) {
            const files = ctx.files.map((file) => {
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
            const isAllImages = files.every(({ mimeType }) => getTypeByMimeType(mimeType) === 'image');
            const isAllVideo = files.every(({ mimeType }) => getTypeByMimeType(mimeType) === 'video');
            const isAllAudio = files.every(({ mimeType }) => getTypeByMimeType(mimeType) === 'audio');

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
            } else {
                this.processUpdate({
                    ...fileEvent,
                    type: 'file',
                });
            }

            return;
        }

        if (ctx.subtype) {
            return;
        }

        const textEvent: UrbanSyntheticEventText<UrbanNativeEventSlack> = {
            ...common,
            type: 'text',
            payload: {
                text: ctx.text,
            },
        };

        return this.processUpdate(textEvent);
    };

    handleCommand = (req: express.Request, res: express.Response) => {
        const { channel_id, command, text, user_id, user_name, channel_name } = req.body as SlackCommandContext;
        const ctx: UrbanSyntheticEventCommand<UrbanNativeEventSlack> = {
            type: 'command',
            chat: {
                id: channel_id,
                title: channel_name,
                username: user_name,
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
                type: UrbanBotSlack.TYPE,
                payload: req.body,
            },
        };
        this.processUpdate(ctx);
        res.sendStatus(200);
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
                if (typeof message.data.file !== 'string') {
                    return (this.client.files.upload({
                        file: message.data.file,
                        channels: message.chat.id,
                        filename: message.data.name,
                        title: message.data.title,
                    }) as unknown) as Promise<SlackMessageMeta>;
                }

                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title ?? '',
                            emoji: true,
                        },
                        image_url: message.data.file,
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
            case 'urban-audio': {
                if (typeof message.data.file === 'string') {
                    throw new Error("@urban-bot/slack doesn't support audio file as string");
                }

                return (this.client.files.upload({
                    file: message.data.file,
                    channels: message.chat.id,
                    filename: message.data.name,
                    title: message.data.title,
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            case 'urban-video': {
                if (typeof message.data.file === 'string') {
                    throw new Error("@urban-bot/slack doesn't support video file as string");
                }

                return (this.client.files.upload({
                    file: message.data.file,
                    channels: message.chat.id,
                    filename: message.data.name,
                    title: message.data.title,
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            case 'urban-file': {
                if (typeof message.data.file === 'string') {
                    throw new Error("@urban-bot/slack doesn't support file as string");
                }

                return (this.client.files.upload({
                    file: message.data.file,
                    filename: message.data.name,
                    channels: message.chat.id,
                    title: message.data.title,
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            case 'urban-animation': {
                if (typeof message.data.file === 'string') {
                    throw new Error("@urban-bot/slack doesn't support animation file as string");
                }

                return (this.client.files.upload({
                    file: message.data.file,
                    filename: message.data.name,
                    channels: message.chat.id,
                    title: message.data.title,
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
            case 'urban-contact': {
                const { firstName, lastName, username, phoneNumber } = message.data;

                return (this.client.chat.postMessage({
                    channel: message.chat.id,
                    text:
                        withRightSpaceIfExist(firstName) +
                        withRightSpaceIfExist(lastName) +
                        '\n' +
                        withRightSpaceIfExist(username) +
                        '\n' +
                        withRightSpaceIfExist(String(phoneNumber)),
                }) as unknown) as Promise<SlackMessageMeta>;
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' is not supported. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
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
                if (typeof message.data.file !== 'string') {
                    throw new Error(
                        'Provide urban-img file as string if you want to edit the image message. @urban-bot/slack',
                    );
                }

                const blocks: KnownBlock[] = [
                    {
                        type: 'image',
                        title: {
                            type: 'plain_text',
                            text: message.data.title ?? '',
                            emoji: true,
                        },
                        image_url: message.data.file,
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
                    }' is not supported to update the message for @urban-bot/slack. You could send a new message every time for this tag.`,
                );
            }
        }
    }

    deleteMessage(message: UrbanExistingMessage<SlackMessageMeta>) {
        this.client.chat.delete({ channel: message.meta.channel, ts: message.meta.ts });
    }
}
