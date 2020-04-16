import React from 'react';
import { SlackBot } from '../src/SlackBot/SlackBot';

import dotenv from 'dotenv';
import { render, Root, Router, Route, useText, ButtonGroup, Button } from '../src';
import { ArrayComponent } from './index';

dotenv.config();

function Main() {
    const [title, setTitle] = React.useState('0');

    useText(({ text }) => {
        setTitle(title + Number(text));
    });

    return (
        <ButtonGroup title="main">
            <Button onClick={() => setTitle(String(Math.random()))}>{title}</Button>
        </ButtonGroup>
    );
}
function App() {
    return (
        <Root
            bot={
                new SlackBot({
                    signingSecret: process.env.SLACK_SIGNING_SECRET,
                    token: process.env.SLACK_TOKEN,
                })
            }
        >
            <Router>
                <Route path="/start">
                    <Main />
                </Route>
                <Route path="/array">
                    <ArrayComponent />
                </Route>
            </Router>
        </Root>
    );
}

render(<App />);
