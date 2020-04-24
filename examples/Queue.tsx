import React from 'react';
import { Button, ButtonGroup, Text } from '../src';

export function Queue() {
    const [array, setArray] = React.useState(['0', '1', '2']);
    const [index, setIndex] = React.useState(array.length);

    const addLast = () => {
        setArray([...array, String(index)]);
        setIndex(index + 1);
    };

    const deleteFirst = () => {
        const [_first, ...newArray] = array;
        setArray(newArray);
    };

    return (
        <>
            <ButtonGroup title={<b>Array</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
            </ButtonGroup>
            {array.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
        </>
    );
}
