import fs from 'fs';
import path from 'path';
import React from 'react';
import { Button, ButtonGroup } from '../src';
import { Audio } from '../src/components/Audio';

const audioByFile = fs.readFileSync(path.join(__dirname, 'audio.mp3'));

export function AudioExample() {
    return (
        <Audio
            audio={audioByFile}
            title="hi"
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            console.log(123);
                        }}
                    >
                        Button
                    </Button>
                </ButtonGroup>
            }
        />
    );
}
