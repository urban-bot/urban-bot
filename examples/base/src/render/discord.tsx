import React, { useState } from 'react';
import { UrbanBotDiscord } from '@urban-bot/discord';
import {
    Image,
    Media,
    render,
    Root,
    Text,
    useAudio,
    useCommand,
    useFile,
    useImage,
    useText,
    useVideo,
    Video,
    ButtonGroup,
    Button,
} from '@urban-bot/core';
import dotenv from 'dotenv';
import { App } from '../App';
import { TextExample } from '../components/Text';
import { FlatDialogExample } from '../components/Dialog';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('Provide DISCORD_TOKEN to .env');
}

const urbanBotDiscord = new UrbanBotDiscord({
    token: DISCORD_TOKEN,
});

function App2() {
    const [text, setText] = useState<string>('Hi!');
    const [image, setImage] = useState<string>();
    const [video, setVideo] = useState<string>();
    // useText(({ image }) => {
    //     console.log(4234234);
    //     setText(image);
    // });

    useText(({ text }) => {
        console.log(123, text);
    });

    useAudio(({ text, files }) => {
        console.log('audios', files, text);
    });

    useFile(({ text, files }) => {
        console.log('files', files, text);
    });

    useImage(({ text, files }) => {
        console.log('images', files, text);
        files[0].url && setImage(files[0].url);
    });

    useVideo(({ text, files }) => {
        console.log('videos', files, text);
        files[0].url && setVideo(files[0].url);
    });

    return (
        <>
            <ButtonGroup title={text}>
                {[
                    [
                        <Button id="button1" onClick={() => setText('Hi again!')}>
                            1
                        </Button>,
                        <Button url="https://google.com">3</Button>,
                    ],
                    [<Button style="DANGER">2</Button>, <Button>4</Button>],
                ]}
            </ButtonGroup>
            {/*{video && (*/}
            {/*    <Media*/}
            {/*        files={[*/}
            {/*            {*/}
            {/*                type: 'image',*/}
            {/*                file:*/}
            {/*                    'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',*/}
            {/*            },*/}
            {/*            {*/}
            {/*                type: 'video',*/}
            {/*                file: video,*/}
            {/*            },*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*)}*/}
            {/*{image && (*/}
            {/*    <Image*/}
            {/*        file={image}*/}
            {/*        // file={photo}*/}
            {/*    />*/}
            {/*)}*/}
            {/*{video && <Video file={video} />}*/}
        </>
    );

    return <FlatDialogExample />;

    return <TextExample />;

    return (
        <Text>
            <i>{image}</i>
        </Text>
    );
}

render(
    <Root bot={urbanBotDiscord} isNewMessageEveryRender>
        <App />
    </Root>,
    () => console.log('discord bot has started'),
);
