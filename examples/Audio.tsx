import fs from 'fs';
import path from 'path';
import React from 'react';
import { Button, ButtonGroup, useText } from '../src';
import { Audio } from '../src/components/Audio';

const audioByFile = fs.readFileSync(path.join(__dirname, 'audio.mp3'));

export function AudioExample() {
    const [author, setAuthor] = React.useState('Some author');

    useText(({ payload }) => {
        setAuthor(payload.text);
    });

    return (
        <Audio
            audio={audioByFile}
            title="There is the song"
            author={author}
            name="Some name"
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            console.log('audio');
                        }}
                    >
                        Button
                    </Button>
                </ButtonGroup>
            }
        />
    );
}
