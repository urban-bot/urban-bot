import React from 'react';
import { ButtonGroup, Button } from '@urban-bot/core';
import { useGlobalCount } from './GlobalCountContext';
import { useCount } from './useCount';

export function App() {
    // if first user push the button, count will be 1,
    // if second user push the button, count will be 2
    const globalCount = useGlobalCount();
    // if first user push the button, count will be 1,
    // if second user push the button, count will be 1
    const localCount = useCount();

    const title = (
        <>
            Total global count: <b>{globalCount.count}</b>
            <br />
            Total local count: <b>{localCount.count}</b>
        </>
    );

    return (
        <ButtonGroup title={title}>
            <Button onClick={globalCount.raiseCount}>Raise global count</Button>
            <Button onClick={localCount.raiseCount}>Raise local count</Button>
        </ButtonGroup>
    );
}
