#!/usr/bin/env node
import dotenv from 'dotenv';
const fetchPromise = import('node-fetch');
import { URL } from 'url';

dotenv.config();

const webhookHost = process.env.WEBHOOK_HOST;

const command = process.argv[2];

switch (command) {
    case 'set-webhook': {
        if (!webhookHost) {
            throw new Error('Provide WEBHOOK_HOST to .env');
        }

        const webhookHostURL = new URL(webhookHost);

        const messengerType = process.argv[3];

        switch (messengerType) {
            case 'telegram': {
                const telegramAPI = 'https://api.telegram.org';
                const telegramToken = process.env.TELEGRAM_TOKEN;

                if (!telegramToken) {
                    throw new Error('Provide TELEGRAM_TOKEN to .env');
                }

                let webhookBase = webhookHostURL.origin + webhookHostURL.pathname;
                webhookBase = webhookBase[webhookBase.length - 1] === '/' ? webhookBase.slice(0, -1) : webhookBase;

                (async function setTelegramWebhook(webhookBase: string, token: string) {
                    const webhookURL = `${webhookBase}/telegram/bot${token}`;
                    const setWebhookURL = `${telegramAPI}/bot${token}/setWebhook?url=${webhookURL}`;

                    try {
                        const fetch = (await fetchPromise).default;
                        const response = await fetch(setWebhookURL);

                        if (!response.ok) {
                            console.log('Webhook is not set');

                            if (response.status === 404) {
                                console.log(`telegram token '${telegramToken}' is not found`);
                            } else {
                                console.log(response.status, response.statusText);
                            }

                            return;
                        }

                        console.log('You have set a webhook to telegram!', webhookURL);
                    } catch (e) {
                        console.log('Webhook is not set');
                        console.error(e);
                    }
                })(webhookBase, telegramToken);

                break;
            }
            default: {
                throw new Error("Provide a correct messenger type. Supported types: 'telegram'");
            }
        }

        break;
    }
    default: {
        throw new Error("Provide a correct command. Supported types: 'set-webhook'");
    }
}
