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
    useAnyEvent,
    useSticker,
    useVoice,
    useAnimation,
    useDice,
    useCommand,
} from '@urban-bot/core';

export function Hooks() {
    const [answer, setAnswer] = React.useState('Please send anything');

    useAnyEvent(() => {
        console.log('calling after any type sending');
    });

    useText(({ text }) => {
        setAnswer("You've sent a text " + text);
    });

    useText(() => {
        setAnswer("You've sent an emoji 😉");
    }, '😉');

    useText(() => {
        setAnswer("You've greeted");
    }, ['hi', /hello/]);

    useCommand(({ command, argument }) => {
        const argumentText = argument ? '. Argument is ' + argument : '';

        setAnswer("You've sent a command " + command + argumentText);
    });

    useCommand(() => {
        setAnswer("You've sent a specific command /setName");
    }, '/setName');

    useImage(({ files }) => {
        const name = files[0].name ?? '';
        setAnswer("You've sent an image " + name);
    });

    useVideo(({ files }) => {
        const name = files[0].name ?? '';
        setAnswer("You've sent a video " + name);
    });

    usePoll(({ question }) => {
        setAnswer("You've sent a poll " + question);
    });

    useLocation(({ latitude, longitude }) => {
        setAnswer("You've sent a location " + latitude + ' ' + longitude);
    });

    useFile(({ files }) => {
        const name = files[0].name ?? '';
        setAnswer("You've sent a file " + name);
    });

    useContact(({ firstName, lastName }) => {
        setAnswer(`You've sent a contact ${firstName} ${lastName ?? ''}`);
    });

    useAudio(({ files }) => {
        const name = files[0].name ?? '';
        setAnswer("You've sent an audio " + name);
    });

    useSticker(({ name, emoji }) => {
        setAnswer("You've sent a sticker " + name + ' ' + emoji);
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

    return (
        <Text isNewMessageEveryRender simulateTyping={1000}>
            {answer}
        </Text>
    );
}
