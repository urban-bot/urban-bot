import React from 'react';
import { Button, ButtonGroup, Text } from '@urban-bot/core';

export function Queue() {
    const [queue, setQueue] = React.useState([0, 1, 2]);
    const queueLength = React.useRef(queue.length);

    const addLast = () => {
        setQueue([...queue, queueLength.current]);
        queueLength.current++;
    };

    const deleteFirst = () => {
        const [_first, ...newQueue] = queue;
        setQueue(newQueue);
    };

    const pasteMiddle = () => {
        const newQueue = [...queue.slice(0, 1), queueLength.current, ...queue.slice(1)];
        setQueue(newQueue);
        queueLength.current++;
    };

    return (
        <>
            <ButtonGroup title={<b>Queue</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
                <Button onClick={pasteMiddle}>Paste middle</Button>
            </ButtonGroup>
            {queue.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
        </>
    );
}
