import React from 'react';
import { UrbanBotSlack } from '@urban-bot/slack';
import { render, Root } from '@urban-bot/core';
import dotenv from 'dotenv';
import { App } from '../App';

dotenv.config();

if (process.env.SLACK_SIGNING_SECRET === undefined) {
    throw new Error(
        'Provide SLACK_SIGNING_SECRET to .env https://api.slack.com/authentication/verifying-requests-from-slack#about',
    );
}

if (process.env.SLACK_TOKEN === undefined) {
    throw new Error('Provide SLACK_TOKEN to .env https://api.slack.com/authentication/token-types#granular_bot');
}

const urbanBotSlack = new UrbanBotSlack({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_TOKEN,
});

render(
    <Root bot={urbanBotSlack} parseMode="markdown">
        <App />
    </Root>,
    () => console.log('slack bot is started'),
);
