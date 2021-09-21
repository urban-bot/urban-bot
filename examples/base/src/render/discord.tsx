import React, { useState } from 'react';
import { UrbanBotDiscord } from '@urban-bot/discord';
import { render, Root, Text, useAudio, useFile, useImage, useText, useVideo } from '@urban-bot/core';
import dotenv from 'dotenv';
import { App } from '../App';
import { TextExample } from '../components/Text';
import { FlatDialogExample } from '../components/Dialog';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('Provide DISCORD_TOKEN to .env');
}

const urbanBotDiscord = new UrbanBotDiscord({
    token: DISCORD_TOKEN,
});

function App2() {
    const [text, setText] = useState('');
    // useText(({ text }) => {
    //     console.log(4234234);
    //     setText(text);
    // });

    useAudio(({ text, files }) => {
        console.log('audios', files, text);
    });

    useFile(({ text, files }) => {
        console.log('files', files, text);
    });

    useImage(({ text, files }) => {
        console.log('images', files, text);
    });

    useVideo(({ text, files }) => {
        console.log('videos', files, text);
    });

    return <FlatDialogExample />;

    return <TextExample />;

    return (
        <Text>
            <i>{text}</i>
        </Text>
    );
}

render(
    <Root bot={urbanBotDiscord}>
        <App2 />
    </Root>,
    () => console.log('discord bot has started'),
);
