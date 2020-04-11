import React from 'react';
import { VkontakteBot } from '../src/vkontakteBot/VkontakteBot';

import dotenv from 'dotenv';
import { render, useMessage, Root, Text } from '../src';

dotenv.config();

const token = process.env.VK_TOKEN;

function Main() {
    const [title, setTitle] = React.useState('0');

    useMessage(({ text }) => {
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
