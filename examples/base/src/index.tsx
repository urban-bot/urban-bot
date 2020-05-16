import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Router, Root, Notification, Text } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotSlack } from '@urban-bot/slack';
import { UrbanBotFacebook } from '@urban-bot/facebook';
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
        <Router>
            <Route path="/start" description="start">
                <ImageExample />
            </Route>
            <Route path="/text" description="text">
                <TextExample />
            </Route>
            <Route path="/buttons" description="buttons">
                <ButtonsExample />
            </Route>
            <Route path="/reply_buttons" description="reply_buttons">
                <ReplyButtonsExample />
            </Route>
            <Route path="/matrix_buttons" description="matrix_buttons">
                <MatrixButtonsExample />
            </Route>
            <Route path="/queue" description="queue">
                <Queue />
            </Route>
            <Route path="/hooks" description="hooks">
                <Hooks />
            </Route>
            <Route path="/audio" description="audio">
                <AudioExample />
            </Route>
            <Route path="/video" description="video">
                <VideoExample />
            </Route>
            <Route path="/file" description="file">
                <FileExample />
            </Route>
            <Route path="/poll" description="poll">
                <PollExample />
            </Route>
            <Route path={new RegExp('/contact*')}>
                <ContactExample />
            </Route>
            <Route path="/animation" description="animation">
                <AnimationExample />
            </Route>
            <Route path="/media" description="media">
                <MediaExample />
            </Route>
            <Route path="/location" description="location">
                <LocationExample />
            </Route>
            <Route path="/notification" description="notification">
                <Notification intervalSeconds={2}>
                    <Text>Ping every two second</Text>
                </Notification>
            </Route>
        </Router>
    );
}

if (process.env.TELEGRAM_TOKEN) {
    const urbanBotTelegram = new UrbanBotTelegram(process.env.TELEGRAM_TOKEN, {
        polling: true,
    });
    render(
        <Root bot={urbanBotTelegram}>
            <App />
        </Root>,
    );
}
if (process.env.SLACK_SIGNING_SECRET && process.env.SLACK_TOKEN) {
    const urbanBotSlack = new UrbanBotSlack({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_TOKEN,
    });

    render(
        <Root bot={urbanBotSlack}>
            <App />
        </Root>,
    );
}

if (process.env.FACEBOOK_APP_SECRET && process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_VERIFY_TOKEN) {
    render(
        <Root
            bot={
                new UrbanBotFacebook({
                    appSecret: process.env.FACEBOOK_APP_SECRET,
                    pageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
                    verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
                })
            }
            isNewMessageEveryRender
        >
            <App />
        </Root>,
    );
}
