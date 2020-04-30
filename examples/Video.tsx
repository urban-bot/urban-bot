// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Button, ButtonGroup, useText, Video } from '../src';

// const videoByFile = fs.readFileSync(path.join(__dirname, 'video.mp4'));

export function VideoExample() {
    const [title, setTitle] = React.useState('There is the video');

    useText(({ text }) => {
        setTitle(text);
    });

    return (
        <Video
            file={'link-to-file' /* || videoByFile */}
            title={title}
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
