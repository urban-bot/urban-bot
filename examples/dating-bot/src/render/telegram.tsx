import React from 'react';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { render, Root } from '@urban-bot/core';
import dotenv from 'dotenv';
import { App } from '../App';

dotenv.config();

if (process.env.TELEGRAM_TOKEN === undefined) {
    throw new Error('Provide TELEGRAM_TOKEN to .env https://core.telegram.org/bots#6-botfather');
}

const urbanBotTelegram = new UrbanBotTelegram(process.env.TELEGRAM_TOKEN, {
    polling: true,
});

render(
    <Root bot={urbanBotTelegram} parseMode="HTML">
        <App />
    </Root>,
    () => console.log('telegram bot is started'),
);
