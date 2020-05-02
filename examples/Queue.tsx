import React from 'react';
import { Button, ButtonGroup, Text } from '../src';

export function Queue() {
    const [queue, setQueue] = React.useState(['0', '1', '2']);
    const queueLength = React.useRef(queue.length);

    const addLast = () => {
        setQueue([...queue, String(queueLength.current)]);
        queueLength.current++;
    };

    const deleteFirst = () => {
        const [_first, ...newQueue] = queue;
        setQueue(newQueue);
    };

    return (
        <>
            <ButtonGroup title={<b>Queue</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
            </ButtonGroup>
            {queue.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
        </>
    );
}
