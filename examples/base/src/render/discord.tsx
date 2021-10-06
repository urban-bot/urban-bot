import React from 'react';
import { UrbanBotDiscord } from '@urban-bot/discord';
import { render, Root } from '@urban-bot/core';
import dotenv from 'dotenv';
import { App } from '../App';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('Provide DISCORD_TOKEN to .env');
}

const urbanBotDiscord = new UrbanBotDiscord({
    token: DISCORD_TOKEN,
    intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

render(
    <Root bot={urbanBotDiscord}>
        <App />
    </Root>,
    () => console.log('discord bot has started'),
);
