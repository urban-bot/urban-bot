#!/usr/bin/env node
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const webhookHost = process.env.WEBHOOK_HOST;

const command = process.argv[2];

switch (command) {
    case 'set-webhook': {
        if (!webhookHost) {
            throw new Error('Provide WEBHOOK_HOST to .env');
        }

        const messengerType = process.argv[3];

        switch (messengerType) {
            case 'telegram': {
                const telegramAPI = 'https://api.telegram.org';
                const telegramToken = process.env.TELEGRAM_TOKEN;

                if (!telegramToken) {
                    throw new Error('Provide TELEGRAM_TOKEN to .env');
                }

                (async function setTelegramWebhook(webhookHost: string, token: string) {
                    const webhookURL = `${webhookHost}/telegram/bot${token}`;
                    const setWebhookURL = `${telegramAPI}/bot${token}/setWebhook?url=${webhookURL}`;

                    try {
                        const rawResponse = await fetch(setWebhookURL);
                        const response = await rawResponse.json();

                        if (!response.ok) {
                            console.log('Webhook is not set');

                            if (response.error_code === 404) {
                                console.log(`telegram token '${telegramToken}' is not found`);
                            } else {
                                console.log(response.error_code, response.description);
                            }

                            return;
                        }

                        console.log('You have set a webhook to telegram!', webhookURL);
                    } catch (e) {
                        console.log('Webhook is not set');
                        console.error(e);
                    }
                })(webhookHost, telegramToken);

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
