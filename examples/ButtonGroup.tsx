/* eslint-disable react/jsx-key */
import React from 'react';
import { ButtonGroup, Button, useText } from '../src';

export function ButtonsExample() {
    return (
        <ButtonGroup title="Buttons">
            <Button onClick={() => console.log('Click first button')}>First button</Button>
            <Button url="https://github.com/urban-bot/urban-bot">Link</Button>
        </ButtonGroup>
    );
}

export function ReplyButtonsExample() {
    const [text, setText] = React.useState('Reply Buttons');

    useText(({ text }) => {
        setText(text);
    });

    return (
        <ButtonGroup title={text} isReplyButtons>
            <Button>Echo</Button>
            <Button>/text</Button>
        </ButtonGroup>
    );
}

export function MatrixButtonsExample() {
    return (
        <ButtonGroup title="Matrix Buttons">
            {[
                [<Button>First button</Button>, <Button>Second button</Button>],
                [<Button>Third button</Button>, <Button>Fourth button</Button>],
            ]}
        </ButtonGroup>
    );
}
