import React from 'react';
import { SlackBot } from '../src/SlackBot/SlackBot';

import dotenv from 'dotenv';
import { render, Root, Text, Router, Route, useText } from '../src';

dotenv.config();

function ArrayComponent() {
    return <Text>Array</Text>;
}

function Main() {
    const [title, setTitle] = React.useState(0);

    useText(({ text }) => {
        setTitle(title + Number(text));
    });

    return <Text>{title}</Text>;
}
function App() {
    return (
        <Root
            isNewMessageEveryRender
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
