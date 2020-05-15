/* eslint-disable @typescript-eslint/camelcase */
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

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import path from 'path';
import GraphAPi from './graph-api';
import config from './config';
const app = express();

const { urlencoded, json } = bodyParser;

type FACEBOOK = 'FACEBOOK';

type UrbanNativeEventFacebook = {
    type: FACEBOOK;
    payload?: any;
};

export type FacebookBotMeta = {
    NativeEvent: any;
    MessageMeta: any;
};

export class UrbanBotFacebook implements UrbanBot<FacebookBotMeta> {
    static TYPE: FACEBOOK = 'FACEBOOK';
    type: FACEBOOK = UrbanBotFacebook.TYPE;
    defaultParseMode: UrbanParseMode = 'markdown';
    client = GraphAPi;

    constructor() {
        // Parse application/x-www-form-urlencoded
        app.use(
            urlencoded({
                extended: true,
            }),
        );

        // Parse application/json. Verify that callback came from Facebook
        app.use(json({ verify: verifyRequestSignature }));

        // Serving static files in Express
        app.use(express.static(path.join(path.resolve(), 'public')));

        // Set template engine in Express
        app.set('view engine', 'ejs');

        // Respond with index file when a GET request is made to the homepage
        app.get('/', function (_req, res) {
            res.render('index');
        });

        // Adds support for GET requests to our webhook
        app.get('/webhook', (req, res) => {
            // Parse the query params
            const mode = req.query['hub.mode'];
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];

            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Checks the mode and token sent is correct
                if (mode === 'subscribe' && token === config.verifyToken) {
                    // Responds with the challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
                    res.status(200).send(challenge);
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.sendStatus(403);
                }
            }
        });

        // Creates the endpoint for your webhook
        app.post('/webhook', (req: any, res: any) => {
            // {
            //     object: 'page',
            //         entry: [
            //     { id: '101620374895957', time: 1589389931083, messaging: [Array] }
            // ]
            // }

            console.log("app.post('/webhook'");

            const text = req.body.entry[0].messaging[0].message.text;
            const id = req.body.entry[0].messaging[0].sender.id;

            const common = {
                chat: { id },
                nativeEvent: {
                    type: UrbanBotFacebook.TYPE,
                    payload: req.body,
                },
                from: { id },
            } as const;

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

            res.send(200);

            // [
            //     {
            //         sender: { id: '2788977971213143' },
            //         recipient: { id: '101620374895957' },
            //         timestamp: 1589389930959,
            //         message: {
            //             mid: 'm_bvP1mc06HROKvH7_i9DaxO18whnUqYz0XnFxIsQbSUdjSf3MTJ25fylAS-9NhuzX63z1UxwzZ4BpMq3OxeP7fg',
            //             text: '234',
            //             nlp: [Object]
            //         }
            //     }
            // ]
        });

        // Verify that the callback came from Facebook.
        function verifyRequestSignature(req: any, _res: any, buf: any) {
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

        // Check if all environment variables are set
        config.checkEnvVariables();

        // listen for requests :)
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

    handleMessage = () => {
        // return this.processUpdate(textEvent);
    };

    async sendMessage(message: UrbanMessage): Promise<any> {
        switch (message.nodeName) {
            case 'urban-text': {
                const requestBody = {
                    recipient: {
                        id: message.chat.id,
                    },
                    message: { text: message.data.text },
                };

                const res = await GraphAPi.callSendAPI(requestBody);

                console.log(res);

                return res;
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
}
