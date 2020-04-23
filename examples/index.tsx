import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Button, ButtonGroup, Router, Root, Text } from '../src';
import { UrbanTelegramBot } from '../src/TelegramBot/UrbanTelegramBot';
import { UrbanSlackBot } from '../src/SlackBot/UrbanSlackBot';
import { TextExample } from './Text';
import { HooksExample } from './hooks';
import { ImageWithButtons } from './Image/ImageWithButtons';

dotenv.config();

export function ArrayComponent() {
    const [array, setArray] = React.useState(['0', '1', '2']);
    const [index, setIndex] = React.useState(array.length);

    const addLast = () => {
        setArray([...array, String(index)]);
        setIndex(index + 1);
    };

    const deleteFirst = () => {
        const [_first, ...newArray] = array;
        setArray(newArray);
    };

    return (
        <>
            <ButtonGroup title={<b>array</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
            </ButtonGroup>
            {array.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
        </>
    );
}

function App() {
    return (
        <Router>
            <Route path="/start">
                <ImageWithButtons />
            </Route>
            <Route path="/text">
                <TextExample />
            </Route>
            <Route path="/array">
                <ArrayComponent />
            </Route>
            <Route path="/hooks">
                <HooksExample />
            </Route>
        </Router>
    );
}

const urbanTelegramBot = new UrbanTelegramBot(process.env.TELEGRAM_TOKEN_DEV as string, {
    polling: true,
});
render(
    <Root bot={urbanTelegramBot} parseMode="HTML">
        <App />
    </Root>,
);

const urbanSlackBot = new UrbanSlackBot({
    signingSecret: process.env.SLACK_SIGNING_SECRET as string,
    token: process.env.SLACK_TOKEN as string,
});
render(
    <Root bot={urbanSlackBot}>
        <App />
    </Root>,
);
