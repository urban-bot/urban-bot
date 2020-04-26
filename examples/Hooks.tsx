import React from 'react';
import {
    Text,
    useText,
    useVideo,
    usePoll,
    useImage,
    useLocation,
    useFile,
    useContact,
    useAudio,
    useAny,
    useSticker,
    useVoice,
    useAnimation,
    useDice,
    useCommand,
} from '../src';

export function Hooks() {
    const [answer, setAnswer] = React.useState('Please send anything');

    useAny(() => {
        console.log('calling after any type sending');
    });

    useText(({ payload }) => {
        setAnswer("You've sent a text " + payload.text);
    });

    useCommand(({ payload }) => {
        setAnswer("You've sent a command " + payload.command);
    });

    useVideo(({ payload }) => {
        const name = payload.files[0].name ?? '';
        setAnswer("You've sent a video " + name);
    });

    usePoll(({ payload }) => {
        setAnswer("You've sent a poll " + payload.question);
    });

    useImage(({ payload }) => {
        const name = payload.files[0].name ?? '';
        setAnswer("You've sent an image " + name);
    });

    useLocation(({ payload }) => {
        setAnswer("You've sent a location " + payload.latitude + ' ' + payload.longitude);
    });

    useFile(({ payload }) => {
        const name = payload.files[0].name ?? '';
        setAnswer("You've sent a file " + name);
    });

    useContact(({ payload }) => {
        setAnswer(`You've sent a contact ${payload.firstName} ${payload.lastName ?? ''}`);
    });

    useAudio(({ payload }) => {
        const name = payload.files[0].name ?? '';
        setAnswer("You've sent an audio " + name);
    });

    useSticker(({ payload }) => {
        setAnswer("You've sent a sticker " + payload.name + ' ' + payload.emoji);
    });

    useVoice(() => {
        setAnswer("You've sent a voice");
    });

    useAnimation(() => {
        setAnswer("You've sent an animation");
    });

    // FIXME rename dice to random
    useDice(({ payload }) => {
        setAnswer("You've sent a dice " + payload.value);
    });

    return <Text isNewMessageEveryRender>{answer}</Text>;
}
