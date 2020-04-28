// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Button, ButtonGroup, useText, Audio } from '../src';

// const audioByFile = fs.readFileSync(path.join(__dirname, 'audio.mp3'));

export function AudioExample() {
    const [author, setAuthor] = React.useState('Some author');

    useText(({ payload }) => {
        setAuthor(payload.text);
    });

    return (
        <Audio
            file={'urlToFile' /* || audioByFile */}
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
