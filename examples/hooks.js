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
} from '../src';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN_DEV;

function App() {
    const [answer, setAnswer] = React.useState('Please send something');

    useMessage(() => {
        console.log('calling after any type sending');
    });

    useText(({ text }) => {
        setAnswer(answer + '\n' + "You've sent text " + text);
    });

    useVideo(() => {
        setAnswer(answer + '\n' + "You've sent video");
    });

    usePoll(({ poll }) => {
        setAnswer(answer + '\n' + "You've sent poll " + poll.question);
    });

    useVideoNote(() => {
        setAnswer(answer + '\n' + "You've sent video note");
    });

    usePhoto(() => {
        setAnswer(answer + '\n' + "You've sent photo");
    });

    useLocation(({ location }) => {
        setAnswer(answer + '\n' + "You've sent location " + location.latitude + ' ' + location.longitude);
    });

    useDocument(({ document }) => {
        setAnswer(answer + '\n' + "You've sent document " + document.file_name);
    });

    useContact(({ contact }) => {
        setAnswer(answer + '\n' + "You've sent contact " + contact.first_name);
    });

    useAudio(({ audio }) => {
        setAnswer(answer + '\n' + "You've sent audio " + audio.title);
    });

    useSticker(({ sticker }) => {
        setAnswer(answer + '\n' + "You've sent sticker " + sticker.emoji);
    });

    useVoice(() => {
        setAnswer(answer + '\n' + "You've sent voice");
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
