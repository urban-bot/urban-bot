/* eslint-disable @typescript-eslint/camelcase */
import { UrbanBot, UrbanMessage, UrbanSyntheticEvent, UrbanParseMode } from '@urban-bot/core';

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { GraphAPI } from './GraphAPI';
import config from './config';
import { FacebookMessageMeta, FacebookPayload } from './types';
import { formatButtons } from './format';

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
            console.log('Your app is listening on port ' + config.port);

            if (Object.keys(config.personas).length == 0 && config.appUrl && config.verifyToken) {
                console.log(
                    'Is this the first time running?\n' +
                        'Make sure to set the both the Messenger profile, persona ' +
                        'and webhook by visiting:\n' +
                        config.appUrl +
                        '/profile?mode=all&verify_token=' +
                        config.verifyToken,
                );
            }

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
                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'button',
                                text: message.data.title,
                                buttons: formatButtons(message.data.buttons),
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
                    }' is not supported. Please don't use it with slack bot or add this logic to @urban-bot/slack.`,
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
