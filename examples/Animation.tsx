import fs from 'fs';
import path from 'path';
import React from 'react';
import { Button, ButtonGroup, Animation, useText } from '../src';

const animationByFile = fs.readFileSync(path.join(__dirname, 'roboHare.gif'));

export function AnimationExample() {
    const [title, setTitle] = React.useState('There is the animation');

    useText(({ text }) => {
        setTitle(text);
    });

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
