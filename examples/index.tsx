import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Router, Root, Notification, Text } from '../src';
import { UrbanBotTelegram } from 'urban-bot-telegram';
import { UrbanBotSlack } from 'urban-bot-slack';
import { TextExample } from './Text';
import { Hooks } from './Hooks';
import { ImageExample } from './Image';
import { Queue } from './Queue';
import { AudioExample } from './Audio';
import { VideoExample } from './Video';
import { FileExample } from './File';
import { PollExample } from './Poll';
import { AnimationExample } from './Animation';
import { ContactExample } from './Contact';
import { MediaExample } from './Media';
import { LocationExample } from './Location';
import { ButtonsExample, ReplyButtonsExample, MatrixButtonsExample } from './ButtonGroup';

dotenv.config();

function App() {
    return (
        <>
            <Router>
                <Route path="/start">
                    <ImageExample />
                </Route>
                <Route path="/text">
                    <TextExample />
                </Route>
                <Route path="/buttons">
                    <ButtonsExample />
                </Route>
                <Route path="/reply_buttons">
                    <ReplyButtonsExample />
                </Route>
                <Route path="/matrix_buttons">
                    <MatrixButtonsExample />
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
                <Route path={new RegExp('/contact*')}>
                    <ContactExample />
                </Route>
                <Route path="/animation">
                    <AnimationExample />
                </Route>
                <Route path="/media">
                    <MediaExample />
                </Route>
                <Route path="/location">
                    <LocationExample />
                </Route>
                <Route path="/notification">
                    <Notification interval={2}>
                        <Text isNewMessageEveryRender>Ping</Text>
                    </Notification>
                </Route>
            </Router>
        </>
    );
}
if (process.env.TELEGRAM_TOKEN_DEV) {
    const urbanBotTelegram = new UrbanBotTelegram(process.env.TELEGRAM_TOKEN_DEV as string, {
        polling: true,
    });
    render(
        <Root bot={urbanBotTelegram} parseMode="HTML">
            <App />
        </Root>,
    );
}
if (process.env.SLACK_SIGNING_SECRET && process.env.SLACK_TOKEN) {
    const urbanBotSlack = new UrbanBotSlack({
        signingSecret: process.env.SLACK_SIGNING_SECRET as string,
        token: process.env.SLACK_TOKEN as string,
    });

    render(
        <Root bot={urbanBotSlack}>
            <App />
        </Root>,
    );
}
