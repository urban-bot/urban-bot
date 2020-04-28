import fs from 'fs';
import path from 'path';
import React from 'react';
import { Button, ButtonGroup, Video } from '../src';

const videoByFile = fs.readFileSync(path.join(__dirname, 'video.mp4'));

export function VideoExample() {
    return (
        <Video
            file={videoByFile}
            title="There is the video"
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
