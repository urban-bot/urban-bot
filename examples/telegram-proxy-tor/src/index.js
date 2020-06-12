import React from 'react';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { render, Root } from '@urban-bot/core';
import dotenv from 'dotenv';
import Agent from 'socks5-https-client/lib/Agent';
import { App } from './App';

dotenv.config();

const { TELEGRAM_TOKEN, PORT } = process.env;

const isDevelopment = process.env.NODE_ENV === 'development';

if (!TELEGRAM_TOKEN) {
    throw new Error('Provide TELEGRAM_TOKEN to .env https://core.telegram.org/bots#6-botfather');
}

const urbanBotTelegram = new UrbanBotTelegram({
    token: TELEGRAM_TOKEN,
    isPolling: isDevelopment,
    // You should enable Tor browser to use this
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: '9150',
        },
    },
});

render(
    <Root bot={urbanBotTelegram} port={PORT ? Number(PORT) : undefined}>
        <App />
    </Root>,
    () => console.log('telegram bot has started'),
);
