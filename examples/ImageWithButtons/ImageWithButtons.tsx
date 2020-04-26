import fs from 'fs';
import path from 'path';
import { Button, ButtonGroup, Image, useBotContext, useRouter, useText } from '../../src';
import React from 'react';
import { UrbanSlackBot } from '../../src/SlackBot/UrbanSlackBot';

const imageByUrl =
    'https://upload.wikimedia.org/wikipedia/commons/3/32/Aeroflot_Tu-154B-2_CCCP-85396_ZRH_1982-6-20.png';
// could be buffer or stream
const imageByFile = fs.readFileSync(path.join(__dirname, 'an-24.jpg'));
// const imageByFile = fs.createReadStream(path.join(__dirname, 'an-24.jpg'));

export function ImageWithButtons() {
    const { bot } = useBotContext();
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('✈️');
    const [isImageFromURL, setIsImageFromURL] = React.useState(true);

    useText(({ payload }) => {
        setTitle(payload.text);
    });

    return (
        <>
            <Image
                file={isImageFromURL ? imageByUrl : imageByFile}
                title={bot.type !== UrbanSlackBot.TYPE ? <b>{title}</b> : title}
                alt="planes"
                buttons={
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                setTitle(title + '✈️');
                            }}
                        >
                            Add plane
                        </Button>
                        <Button
                            onClick={() => {
                                setIsImageFromURL(!isImageFromURL);
                            }}
                        >
                            Toggle picture
                        </Button>
                        <Button onClick={() => navigate('/text')}>Go to text</Button>
                    </ButtonGroup>
                }
            />
        </>
    );
}
