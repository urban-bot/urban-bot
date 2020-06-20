import dotenv from 'dotenv';
import React from 'react';
import { Route, Router, Notification, Text } from '@urban-bot/core';
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
import { RouterExample } from './Router';
import { GetAnswersExample } from './GetAnswers';

dotenv.config();

export function App() {
    return (
        <Router>
            <Route path="/start" description="image">
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
            <Route path="/hooks" description="hooks">
                <Hooks />
            </Route>
            <Route path="/answers">
                <GetAnswersExample />
            </Route>
            <Route path="/queue" description="queue">
                <Queue />
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
            <Route path="/router" description="router">
                <RouterExample />
            </Route>
            <Route path="/notification" description="notification">
                <Notification intervalSeconds={2}>
                    <Text>Ping every two second</Text>
                </Notification>
            </Route>
        </Router>
    );
}
