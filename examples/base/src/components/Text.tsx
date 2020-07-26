import React from 'react';
import { Text, useBotContext } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';

const someCode = `function sum2() {
    return 2 + 2;
}

if (sum2() !== 4) {
    console.log('WTF');
}`;

export function TextExample() {
    const { bot } = useBotContext();

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
            {bot.type !== UrbanBotTelegram.TYPE ? (
                <>
                    <q>quote</q>
                    <br />
                </>
            ) : null}
            <b>
                Bold and <s>Strikethrough text</s>
            </b>
            <br />
            <code>Code 2 + 2</code>
            <br />
            <pre>{someCode}</pre>
            <br />
            <a href="https://github.com/urban-bot/urban-bot">External link</a>
        </Text>
    );
}
