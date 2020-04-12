import dotenv from 'dotenv';
import React from 'react';
import { render, Root, Text, useBotContext } from '../src';
import { TelegramBot } from '../src/TelegramBot/TelegramBot';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN_DEV;

const someCode = `function sum2() {
    return 2 + 2;
}

if (sum2() !== 4) {
    console.log('WTF');
}`;

function App() {
    const {
        user: { id: userId },
    } = useBotContext();

    return (
        <Text>
            Usual text
            <br />
            <b>Bold text</b>
            <br />
            <i>Italic text</i>
            <br />
            <u>Underscore text</u>
            <br />
            <s>Strikethrough text</s>
            <br />
            <b>
                Bold and{' '}
                <u>
                    Underscore and <s>Strikethrough</s> text
                </u>
            </b>
            <br />
            <code>Code 2 + 2</code>
            <br />
            <pre>{someCode}</pre>
            <br />
            <a userId={userId}>Link to your profile</a>
            <br />
            <a href="https://github.com/urban-bot/urban-bot">External link</a>
        </Text>
    );
}

render(
    <Root
        bot={
            new TelegramBot(token, {
                polling: true,
            })
        }
    >
        <App />
    </Root>,
);
