import dotenv from 'dotenv';
import React from 'react';
import {
    render,
    Root,
    Text,
    useText,
    useVideo,
    usePoll,
    usePhoto,
    useLocation,
    useDocument,
    useContact,
    useAudio,
    useAny,
    useSticker,
    useVoice,
    useAnimation,
    useDice,
    useCommand,
} from '../src';
import { TelegramBot } from '../src/TelegramBot/TelegramBot';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN_DEV;

function App() {
    const [answer, setAnswer] = React.useState();

    useAny(() => {
        console.log('calling after any type sending');
    });

    useText(({ text }) => {
        setAnswer("You've sent a text " + text);
    });

    useCommand(({ command }) => {
        setAnswer("You've sent a command " + command);
    });

    useVideo(() => {
        setAnswer("You've sent a video");
    });

    usePoll(({ poll }) => {
        setAnswer("You've sent a poll " + poll.question);
    });

    usePhoto(() => {
        setAnswer("You've sent a photo");
    });

    useLocation(({ location }) => {
        setAnswer("You've sent a location " + location.latitude + ' ' + location.longitude);
    });

    useDocument(({ document }) => {
        setAnswer("You've sent a document " + document.file_name);
    });

    useContact(({ contact }) => {
        setAnswer("You've sent a contact " + contact.first_name);
    });

    useAudio(({ audio }) => {
        setAnswer("You've sent an audio " + audio.title);
    });

    useSticker(({ sticker }) => {
        setAnswer("You've sent a sticker " + sticker.emoji);
    });

    useVoice(() => {
        setAnswer("You've sent a voice");
    });

    useAnimation(() => {
        setAnswer("You've sent an animation");
    });

    useDice(({ dice }) => {
        setAnswer("You've sent a dice " + dice.value);
    });

    if (!answer) {
        return null;
    }

    return <Text isNewMessageEveryRender>{answer}</Text>;
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
