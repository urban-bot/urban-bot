import React from 'react';
import { SlackBot } from '../src/SlackBot/SlackBot';

import dotenv from 'dotenv';
import { render, useMessage, Root, Text, Router, Route } from '../src';

dotenv.config();

function ArrayComponent() {
    return <Text>Array</Text>;
}

function Main() {
    const [title, setTitle] = React.useState(0);

    useMessage(({ text }) => {
        setTitle(title + Number(text));
    });

    return <Text>{title}</Text>;
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
            <Main />
        </Root>
    );
}

render(<App />);
