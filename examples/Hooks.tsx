import React from 'react';
import {
    Text,
    useText,
    useVideo,
    usePoll,
    useImage,
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

export function Hooks() {
    const [answer, setAnswer] = React.useState('');

    useAny(() => {
        console.log('calling after any type sending');
    });

    useText(({ payload }) => {
        setAnswer("You've sent a text " + payload.text);
    });

    useCommand(({ payload }) => {
        setAnswer("You've sent a command " + payload.command);
    });

    useVideo(() => {
        setAnswer("You've sent a video");
    });

    usePoll(({ payload }) => {
        setAnswer("You've sent a poll " + payload.question);
    });

    useImage(() => {
        setAnswer("You've sent a photo");
    });

    useLocation(({ payload }) => {
        setAnswer("You've sent a location " + payload.latitude + ' ' + payload.longitude);
    });

    useDocument(({ payload }) => {
        setAnswer("You've sent a document " + payload.fileName);
    });

    useContact(({ payload }) => {
        setAnswer(`You've sent a contact ${payload.firstName} ${payload.lastName ?? ''}`);
    });

    useAudio(({ payload }) => {
        setAnswer("You've sent an audio " + payload.title);
    });

    useSticker(({ payload }) => {
        setAnswer("You've sent a sticker " + payload.name);
    });

    useVoice(() => {
        setAnswer("You've sent a voice");
    });

    useAnimation(() => {
        setAnswer("You've sent an animation");
    });

    useDice(({ payload }) => {
        setAnswer("You've sent a dice " + payload.value);
    });

    if (!answer) {
        return null;
    }

    return <Text isNewMessageEveryRender>{answer}</Text>;
}
