import dotenv from 'dotenv';
import React from 'react';
import { Route, Router, Notification, Text } from '@urban-bot/core';
import { TextExample } from './components/Text';
import { Hooks } from './components/Hooks';
import { ImageExample } from './components/Image';
import { Queue } from './components/Queue';
import { AudioExample } from './components/Audio';
import { VideoExample } from './components/Video';
import { FileExample } from './components/File';
import { PollExample } from './components/Poll';
import { AnimationExample } from './components/Animation';
import { ContactExample } from './components/Contact';
import { MediaExample } from './components/Media';
import { LocationExample } from './components/Location';
import {
    ButtonsExample,
    ReplyButtonsExample,
    MatrixButtonsExample,
    MatrixButtonsMaxColumnsExample,
} from './components/ButtonGroup';
import { RouterExample } from './components/Router';
import { FlatDialogExample, TreeDialogExample } from './components/Dialog';
import { CheckboxDialogExample } from './components/CheckboxDialog';

dotenv.config();

export function App() {
    return (
        <Router>
            <Route path="/image" description="image">
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
            <Route path="/matrix_buttons_max_columns" description="matrix_buttons_max_columns">
                <MatrixButtonsMaxColumnsExample />
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
            <Route path="/router" description="router">
                <RouterExample />
            </Route>
            <Route path="/flat_dialog" description="flat_dialog">
                <FlatDialogExample />
            </Route>
            <Route path="/tree_dialog" description="tree_dialog">
                <TreeDialogExample />
            </Route>
            <Route path="/checkbox_dialog" description="checkbox_dialog">
                <CheckboxDialogExample />
            </Route>
            <Route path="/notification" description="notification">
                <Notification intervalSeconds={2}>
                    <Text>Ping every two second</Text>
                </Notification>
            </Route>
            <Route path="/start" description="start">
                <Text isNewMessageEveryRender>
                    /text
                    <br />
                    /image
                    <br />
                    /buttons
                    <br />
                    /reply_buttons
                    <br />
                    /matrix_buttons
                    <br />
                    /matrix_buttons_max_columns
                    <br />
                    /hooks
                    <br />
                    /tree_dialog
                    <br />
                    /flat_dialog
                    <br />
                    /checkbox_dialog
                    <br />
                    /queue
                    <br />
                    /audio
                    <br />
                    /video
                    <br />
                    /file
                    <br />
                    /poll
                    <br />
                    /contact
                    <br />
                    /animation
                    <br />
                    /media
                    <br />
                    /location
                    <br />
                    /router
                    <br />
                    /notification
                </Text>
            </Route>
        </Router>
    );
}
