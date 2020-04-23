import fs from 'fs';
import path from 'path';
import { Button, ButtonGroup, Image, useBotContext, useRouter, useText } from '../../src';
import React from 'react';
import { UrbanSlackBot } from '../../src/SlackBot/UrbanSlackBot';

// FIXME make normal paths
const photoIL = fs.readFileSync(path.join(__dirname, '../../../examples/Image', 'IL86.jpg'));
const photoAN = fs.readFileSync(path.join(__dirname, '../../../examples/Image', 'AN24.jpg'));

export function ImageWithButtons() {
    const { bot } = useBotContext();
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('0');
    const [isFirstImage, setIsFirstImage] = React.useState(true);

    useText(() => {
        setIsFirstImage(!isFirstImage);
    });

    return (
        <Image
            image={isFirstImage ? photoIL : photoAN}
            title={bot.type !== UrbanSlackBot.TYPE ? <b>{title}</b> : title}
            alt="girls "
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            setTitle(title + 1);
                        }}
                    >
                        Change title
                    </Button>
                    <Button
                        onClick={() => {
                            setIsFirstImage(!isFirstImage);
                        }}
                    >
                        Toggle picture
                    </Button>
                    <Button onClick={() => navigate('/text')}>Go to text</Button>
                </ButtonGroup>
            }
        />
    );
}
