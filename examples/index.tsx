import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Router, Root } from '../src';
import { UrbanTelegramBot } from '../src/TelegramBot/UrbanTelegramBot';
import { UrbanSlackBot } from '../src/SlackBot/UrbanSlackBot';
import { TextExample } from './Text';
import { Hooks } from './Hooks';
import { ImageExample } from './ImageExample/ImageExample';
import { Queue } from './Queue';
import { AudioExample } from './Audio';
import { VideoExample } from './Video';
import { FileExample } from './File';
import { PollExample } from './Poll';

dotenv.config();

function App() {
    return (
        <Router>
            <Route path="/start">
                <ImageExample />
            </Route>
            <Route path="/text">
                <TextExample />
            </Route>
            <Route path="/queue">
                <Queue />
            </Route>
            <Route path="/hooks">
                <Hooks />
            </Route>
            <Route path="/audio">
                <AudioExample />
            </Route>
            <Route path="/video">
                <VideoExample />
            </Route>
            <Route path="/file">
                <FileExample />
            </Route>
            <Route path="/poll">
                <PollExample />
            </Route>
        </Router>
    );
}

const urbanTelegramBot = new UrbanTelegramBot(process.env.TELEGRAM_TOKEN_DEV as string, {
    polling: true,
});
render(
    <Root bot={urbanTelegramBot} parseMode="HTML">
        <App />
    </Root>,
);

const urbanSlackBot = new UrbanSlackBot({
    signingSecret: process.env.SLACK_SIGNING_SECRET as string,
    token: process.env.SLACK_TOKEN as string,
});
render(
    <Root bot={urbanSlackBot}>
        <App />
    </Root>,
);
