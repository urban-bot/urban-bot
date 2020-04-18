import React from 'react';
import {
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
} from '../dist';

export function HooksExample() {
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

    usePoll(({ question }) => {
        setAnswer("You've sent a poll " + question);
    });

    usePhoto(() => {
        setAnswer("You've sent a photo");
    });

    useLocation(({ latitude, longitude }) => {
        setAnswer("You've sent a location " + latitude + ' ' + longitude);
    });

    useDocument(({ fileName }) => {
        setAnswer("You've sent a document " + fileName);
    });

    useContact(({ firstName }) => {
        setAnswer("You've sent a contact " + firstName);
    });

    useAudio(({ title }) => {
        setAnswer("You've sent an audio " + title);
    });

    useSticker(({ emoji }) => {
        setAnswer("You've sent a sticker " + emoji);
    });

    useVoice(() => {
        setAnswer("You've sent a voice");
    });

    useAnimation(() => {
        setAnswer("You've sent an animation");
    });

    useDice(({ value }) => {
        setAnswer("You've sent a dice " + value);
    });

    if (!answer) {
        return null;
    }

    return <Text isNewMessageEveryRender>{answer}</Text>;
}
