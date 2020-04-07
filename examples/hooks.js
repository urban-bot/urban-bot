import dotenv from 'dotenv';
import React from 'react';
import {
    render,
    Root,
    Text,
    useText,
    useVideo,
    usePoll,
    useVideoNote,
    usePhoto,
    useLocation,
    useDocument,
    useContact,
    useAudio,
    useMessage,
    useSticker,
    useVoice,
    useAnimation,
} from '../src';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN_DEV;

function App() {
    const [answer, setAnswer] = React.useState('Please send something');

    useMessage(() => {
        console.log('calling after any type sending');
    });

    useText(({ text }) => {
        setAnswer(answer + '\n' + "You've sent a text " + text);
    });

    useVideo(() => {
        setAnswer(answer + '\n' + "You've sent a video");
    });

    usePoll(({ poll }) => {
        setAnswer(answer + '\n' + "You've sent a poll " + poll.question);
    });

    useVideoNote(() => {
        setAnswer(answer + '\n' + "You've sent a video note");
    });

    usePhoto(() => {
        setAnswer(answer + '\n' + "You've sent a photo");
    });

    useLocation(({ location }) => {
        setAnswer(answer + '\n' + "You've sent a location " + location.latitude + ' ' + location.longitude);
    });

    useDocument(({ document }) => {
        setAnswer(answer + '\n' + "You've sent a document " + document.file_name);
    });

    useContact(({ contact }) => {
        setAnswer(answer + '\n' + "You've sent a contact " + contact.first_name);
    });

    useAudio(({ audio }) => {
        setAnswer(answer + '\n' + "You've sent an audio " + audio.title);
    });

    useSticker(({ sticker }) => {
        setAnswer(answer + '\n' + "You've sent a sticker " + sticker.emoji);
    });

    useVoice(() => {
        setAnswer(answer + '\n' + "You've sent a voice");
    });

    useAnimation(() => {
        setAnswer(answer + '\n' + "You've sent an animation");
    });

    return <Text>{answer}</Text>;
}

render(
    <Root
        token={token}
        options={{
            polling: true,
        }}
    >
        <App />
    </Root>,
);
