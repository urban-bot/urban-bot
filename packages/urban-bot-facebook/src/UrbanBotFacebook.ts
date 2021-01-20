/* eslint-disable @typescript-eslint/camelcase */
import { UrbanBot, UrbanMessage, UrbanSyntheticEvent, UrbanParseMode } from '@urban-bot/core';

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { GraphAPI } from './GraphAPI';
import { FacebookMessageMeta, FacebookPayload } from './types';
import { formatGenericTemplate, formatReplyButtons } from './format';

const { urlencoded, json } = bodyParser;

export type FACEBOOK = 'FACEBOOK';

export type UrbanNativeEventFacebook<Payload = FacebookPayload> = {
    type: FACEBOOK;
    payload?: Payload;
};

export type UrbanBotFacebookType<Payload = FacebookPayload> = {
    NativeEvent: UrbanNativeEventFacebook<Payload>;
    MessageMeta: FacebookMessageMeta;
};

export type FacebookOptions = {
    pageAccessToken: string;
    // Your App secret can be found in App Dashboard -> Settings -> Basic
    appSecret: string;
    // A random string that is used for the webhook verification request
    verifyToken: string;
    pageId?: string;
    appId?: string;
    // URL where you host this code
    webhookUrl?: string;
    apiUrl?: string;
    apiUrlVersion?: string;
    pathnamePrefix?: string;
};

const defaultOptions: Partial<FacebookOptions> = {
    apiUrl: 'https://graph.facebook.com',
    apiUrlVersion: 'v3.2',
};

export class UrbanBotFacebook implements UrbanBot<UrbanBotFacebookType> {
    static TYPE: FACEBOOK = 'FACEBOOK';
    type: FACEBOOK = UrbanBotFacebook.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    commandPrefix = '/';
    client: GraphAPI;
    options: FacebookOptions;

    constructor(options: FacebookOptions) {
        if (!('pageAccessToken' in options)) {
            throw new Error(`Provide pageAccessToken to @urban-bot/facebook options`);
        }

        if (!('appSecret' in options)) {
            throw new Error(`Provide appSecret to @urban-bot/facebook options`);
        }

        this.options = { ...defaultOptions, ...options };
        this.client = new GraphAPI(this.options);
    }
    initializeServer(expressApp: express.Express) {
        const pathnamePrefix = this.options.pathnamePrefix ?? '';

        expressApp.use(
            `${pathnamePrefix}/facebook/*`,
            urlencoded({
                extended: true,
            }),
        );

        expressApp.use(`${pathnamePrefix}/facebook/*`, json({ verify: this.verifyRequestSignature }));

        expressApp.get(`${pathnamePrefix}/facebook/webhook`, (req, res) => {
            const mode = req.query?.['hub.mode'];
            const token = req.query?.['hub.verify_token'];
            const challenge = req.query?.['hub.challenge'];

            if (mode && token) {
                if (mode === 'subscribe' && token === this.options.verifyToken) {
                    console.log('webhook verified');
                    res.status(200).send(challenge);
                } else {
                    console.error('webhook not verified');
                    res.sendStatus(403);
                }
            }
        });

        expressApp.post('/facebook/webhook', (req, res) => {
            const payload = req.body as FacebookPayload;

            this.handleEvent(payload);
            res.sendStatus(200);
        });

        if (this.options.pageId !== undefined) {
            console.log('Test your app by messaging:');
            console.log('https://m.me/' + this.options.pageId);
        }
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanBotFacebookType>) {
        throw new Error('this method must be overridden');
    }

    handleEvent(payload: FacebookPayload) {
        const { message, sender, postback } = payload.entry[0].messaging[0];
        const { id } = sender;
        const common = {
            chat: { id },
            nativeEvent: {
                type: UrbanBotFacebook.TYPE,
                payload,
            },
            from: { id },
        } as const;

        if (postback) {
            this.processUpdate({
                ...common,
                type: 'action',
                payload: {
                    actionId: postback.payload,
                },
            });

            return;
        }

        if (message) {
            const { text, attachments } = message;
            if (attachments) {
                const files = attachments.map(({ type, payload }) => ({
                    type,
                    ...payload,
                }));

                const fileEvent = {
                    ...common,
                    payload: {
                        text,
                        files,
                    },
                } as const;
                const isAllImages = files.every(({ type }) => type === 'image');
                const isAllVideo = files.every(({ type }) => type === 'video');
                const isAllAudio = files.every(({ type }) => type === 'audio');

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
            } else {
                if (text !== undefined) {
                    if (text[0] === this.commandPrefix) {
                        const [command, ...args] = text.split(' ');
                        this.processUpdate({
                            ...common,
                            type: 'command',
                            payload: { command, argument: args.join(' ') },
                        });
                    } else {
                        this.processUpdate({
                            ...common,
                            type: 'text',
                            payload: { text },
                        });
                    }
                }
            }
        }
    }

    async sendMessage(message: UrbanMessage): Promise<FacebookMessageMeta> {
        const common = {
            recipient: {
                id: message.chat.id,
            },
            tag: message.data.tag,
            persona_id: message.data.personaId,
        } as const;

        switch (message.nodeName) {
            case 'urban-text': {
                const requestBody = {
                    ...common,
                    message: { text: message.data.text },
                };

                return this.client.callSendAPI(requestBody);
            }
            case 'urban-buttons': {
                let requestBody;
                if (message.data.isReplyButtons) {
                    requestBody = {
                        ...common,
                        message: {
                            text: message.data.title,
                            quick_replies: formatReplyButtons(message.data.buttons),
                        },
                    };
                } else {
                    const subtitle = typeof message.data.subtitle === 'string' ? message.data.subtitle : undefined;
                    requestBody = {
                        ...common,
                        message: {
                            attachment: formatGenericTemplate({
                                title: message.data.title,
                                subtitle,
                                buttons: message.data.buttons,
                            }),
                        },
                    };
                }

                return this.client.callSendAPI(requestBody);
            }
            case 'urban-img': {
                if (typeof message.data.file !== 'string') {
                    // TODO add file from file system support
                    throw new Error('@urban-bot/facebook support image file only as string');
                }

                if (message.data.isReplyButtons) {
                    throw new Error("@urban-bot/facebook Don't use isReplyButtons with Image component");
                }

                const subtitle = typeof message.data.subtitle === 'string' ? message.data.subtitle : undefined;
                const requestBody = {
                    ...common,
                    message: {
                        attachment: formatGenericTemplate({
                            title: message.data.title,
                            subtitle,
                            buttons: message.data.buttons,
                            image_url: message.data.file,
                        }),
                    },
                };

                return this.client.callSendAPI(requestBody);
            }
            case 'urban-audio': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support audio file only as string');
                }

                const requestBody = {
                    ...common,
                    message: {
                        attachment: {
                            type: 'audio',
                            payload: {
                                url: message.data.file,
                                is_reusable: message.data.is_reusable,
                            },
                        },
                    },
                };

                return this.client.callSendAPI(requestBody);
            }
            case 'urban-video': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support video file only as string');
                }

                const requestBody = {
                    ...common,
                    message: {
                        attachment: {
                            type: 'video',
                            payload: {
                                url: message.data.file,
                                is_reusable: message.data.is_reusable,
                            },
                        },
                    },
                };

                return this.client.callSendAPI(requestBody);
            }
            case 'urban-file': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support file only as string');
                }

                const requestBody = {
                    ...common,
                    message: {
                        attachment: {
                            type: 'file',
                            payload: {
                                url: message.data.file,
                                is_reusable: message.data.is_reusable,
                            },
                        },
                    },
                };

                return this.client.callSendAPI(requestBody);
            }
            default: {
                throw new Error(
                    `Tag '${
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (message as any).nodeName
                    }' is not supported. Please don't use it with facebook bot or add this logic to @urban-bot/facebook.`,
                );
            }
        }
    }

    verifyRequestSignature = (req: any, _res: any, buf: any) => {
        const signature = req?.headers['x-hub-signature'];

        if (!signature) {
            console.error("Couldn't validate the signature.");
        } else {
            const elements = signature.split('=');
            const signatureHash = elements[1];
            const expectedHash = crypto.createHmac('sha1', this.options.appSecret).update(buf).digest('hex');
            if (signatureHash != expectedHash) {
                throw new Error("Couldn't validate the request signature.");
            }
        }
    };
}
