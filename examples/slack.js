import React from 'react';
import { SlackBot } from '../src/SlackBot/SlackBot';

import dotenv from 'dotenv';
import { render, useMessage, Root, Text } from '../src';

dotenv.config();

function Main() {
    const [title, setTitle] = React.useState('Send message');

    useMessage(({ text }) => {
        setTitle(text);
    });

    return <Text>{title}</Text>;
}

function App() {
    return (
        <Root
            bot={
                new SlackBot({
                    signingSecret: '6f28eeba42717acfb2249c78e6a4b190',
                    token: 'xoxb-1067397452132-1061285523475-FYuXpydlFDZnhKHRghGKbg18',
                })
            }
        >
            <Main />
        </Root>
    );
}

render(<App />);
