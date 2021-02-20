# Global Count

An example how to keep a global state for every chatbots users.

```javascript
import React from 'react';
import { ButtonGroup, Button } from '@urban-bot/core';
import { useCount, useGlobalCount } from './GlobalCount';

export function App() {
    // if first user push the button, count will be 1,
    // if second user push the button, count will be 2
    const globalCount = useGlobalCount();
    // if first user push the button, count will be 1,
    // if second user push the button, count will be 1
    const localCount = useCount();

    const title = (
        <>
            Total local count: <b>{globalCount.count}</b>
            <br />
            Total global count: <b>{localCount.count}</b>
        </>
    );

    return (
        <ButtonGroup title={title}>
            <Button onClick={globalCount.raiseCount}>Raise total count</Button>
            <Button onClick={localCount.raiseCount}>Raise local count</Button>
        </ButtonGroup>
    );
}
```