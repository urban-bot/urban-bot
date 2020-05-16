/* eslint-disable @typescript-eslint/camelcase */
import { UrbanBot, UrbanMessage, UrbanSyntheticEvent, UrbanParseMode } from '@urban-bot/core';

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { GraphAPI } from './GraphAPI';
import config from './config';
import { FacebookMessageMeta, FacebookPayload } from './types';
import { formatGenericTemplate, formatReplyButtons } from './format';

const { urlencoded, json } = bodyParser;

export type FACEBOOK = 'FACEBOOK';

export type UrbanNativeEventFacebook = {
    type: FACEBOOK;
    payload?: FacebookPayload;
};

export type FacebookBotMeta = {
    NativeEvent: UrbanNativeEventFacebook;
    MessageMeta: FacebookMessageMeta;
};

export class UrbanBotFacebook implements UrbanBot<FacebookBotMeta> {
    static TYPE: FACEBOOK = 'FACEBOOK';
    type: FACEBOOK = UrbanBotFacebook.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    client = GraphAPI;

    constructor() {
        const app = express();

        app.use(
            urlencoded({
                extended: true,
            }),
        );

        app.use(json({ verify: this.verifyRequestSignature }));

        app.get('/webhook', (req, res) => {
            const mode = req.query['hub.mode'];
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];

            if (mode && token) {
                if (mode === 'subscribe' && token === config.verifyToken) {
                    console.log('WEBHOOK_VERIFIED');
                    res.status(200).send(challenge);
                } else {
                    res.sendStatus(403);
                }
            }
        });

        app.post('/webhook', (req, res) => {
            const payload = req.body as FacebookPayload;

            this.handleEvent(payload);
            res.sendStatus(200);
        });

        config.checkEnvVariables();

        app.listen(config.port, function () {
            console.log('@urban-bot/facebook has started');

            if (config.pageId) {
                console.log('Test your app by messaging:');
                console.log('https://m.me/' + config.pageId);
            }
        });
    }

    processUpdate(_event: UrbanSyntheticEvent<UrbanNativeEventFacebook>) {
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
                    if (text[0] === '/') {
                        this.processUpdate({
                            ...common,
                            type: 'command',
                            payload: { command: text },
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
        switch (message.nodeName) {
            case 'urban-text': {
                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
                    message: { text: message.data.text },
                };

                return GraphAPI.callSendAPI(requestBody);
            }
            case 'urban-buttons': {
                const common = {
                    recipient: {
                        id: message.chat.id,
                    },
                } as const;

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

                return GraphAPI.callSendAPI(requestBody);
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
                    recipient: {
                        id: message.chat.id,
                    },
                    message: {
                        attachment: formatGenericTemplate({
                            title: message.data.title,
                            subtitle,
                            buttons: message.data.buttons,
                            image_url: message.data.file,
                        }),
                    },
                };

                return GraphAPI.callSendAPI(requestBody);
            }
            case 'urban-audio': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support audio file only as string');
                }

                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
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

                return GraphAPI.callSendAPI(requestBody);
            }
            case 'urban-video': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support video file only as string');
                }

                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
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

                return GraphAPI.callSendAPI(requestBody);
            }
            case 'urban-file': {
                if (typeof message.data.file !== 'string') {
                    throw new Error('@urban-bot/facebook support file only as string');
                }

                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
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

                return GraphAPI.callSendAPI(requestBody);
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

    verifyRequestSignature(req: any, _res: any, buf: any) {
        const signature = req.headers['x-hub-signature'];

        if (!signature) {
            console.log("Couldn't validate the signature.");
        } else {
            const elements = signature.split('=');
            const signatureHash = elements[1];
            const expectedHash = crypto
                .createHmac('sha1', config.appSecret as string)
                .update(buf)
                .digest('hex');
            if (signatureHash != expectedHash) {
                throw new Error("Couldn't validate the request signature.");
            }
        }
    }
}
