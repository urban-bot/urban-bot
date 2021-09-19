import React, { useState } from 'react';
import { UrbanBotDiscord } from '@urban-bot/discord';
import { render, Root, Text, useText } from '@urban-bot/core';
import dotenv from 'dotenv';
// import { App } from '../App';
import { TextExample } from '../components/Text';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('Provide DISCORD_TOKEN to .env');
}

const urbanBotDiscord = new UrbanBotDiscord({
    token: DISCORD_TOKEN,
});

function App() {
    const [text, setText] = useState('');
    useText(({ text }) => {
        console.log(4234234);
        setText(text);
    });

    return <TextExample />;
    //
    // return (
    //     <Text>
    //         <i>{text}</i>
    //     </Text>
    // );
}

render(
    <Root bot={urbanBotDiscord}>
        <App />
    </Root>,
    () => console.log('discord bot has started'),
);
