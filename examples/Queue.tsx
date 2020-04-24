import React from 'react';
import { Button, ButtonGroup, Text } from '../src';

export function Queue() {
    const [queue, setQueue] = React.useState(['0', '1', '2']);
    const [last, setLast] = React.useState(queue.length);

    const addLast = () => {
        setQueue([...queue, String(last)]);
        setLast(last + 1);
    };

    const deleteFirst = () => {
        const [_first, ...newArray] = queue;
        setQueue(newArray);
    };

    return (
        <>
            <ButtonGroup title={<b>Array</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
            </ButtonGroup>
            {queue.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
        </>
    );
}
