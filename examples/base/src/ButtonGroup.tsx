/* eslint-disable react/jsx-key */
import React from 'react';
import { ButtonGroup, Button } from '@urban-bot/core';

export function ButtonsExample() {
    return (
        <ButtonGroup title="Buttons">
            <Button onClick={() => console.log('Click first button')}>First button</Button>
            <Button url="https://github.com/urban-bot/urban-bot">Link</Button>
        </ButtonGroup>
    );
}

export function ReplyButtonsExample() {
    return (
        <ButtonGroup isNewMessageEveryRender title="Reply Buttons" isReplyButtons>
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
