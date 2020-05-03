import fs from 'fs';
import path from 'path';
import React, { useMemo } from 'react';
import { Button, ButtonGroup, Animation, useText } from '../src';

function readFile(fileName: string) {
    try {
        return fs.readFileSync(path.join(__dirname, fileName));
    } catch (error) {
        return undefined;
    }
}

export function AnimationExample() {
    const [title, setTitle] = React.useState('There is the animation');

    useText(({ text }) => {
        setTitle(text);
    });

    const animationByFile = useMemo(() => readFile('roboHare.gif'), []);

    if (!animationByFile) {
        return null;
    }

    return (
        <Animation
            file={animationByFile /* || animationByFile */}
            title={title}
            name={'fileName'}
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            console.log('animation');
                        }}
                    >
                        Button
                    </Button>
                </ButtonGroup>
            }
        />
    );
}
