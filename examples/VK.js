import React from 'react';
import { VkontakteBot } from '../dist/VkontakteBot/VkontakteBot';

import dotenv from 'dotenv';
import { render, useAny, Root, Text } from '../dist';

dotenv.config();

const token = process.env.VK_TOKEN;

function Main() {
    const [title, setTitle] = React.useState('0');

    useAny(({ text }) => {
        setTitle(text);
    });

    return <Text isNewMessageEveryRender={true}>{`Message: ${title}`}</Text>;
}

function App() {
    return (
        <Root bot={new VkontakteBot(token)}>
            <Main />
        </Root>
    );
}

render(<App />);
