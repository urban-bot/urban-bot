import React from 'react';
import { Button, ButtonGroup, Poll, Option } from '../src';

export function PollExample() {
    return (
        <Poll
            question="How are you?"
            buttons={
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            console.log('poll');
                        }}
                    >
                        Button
                    </Button>
                </ButtonGroup>
            }
        >
            <Option>Awesome</Option>
            <Option>Fine</Option>
            <Option>Ok</Option>
            <Option>😐</Option>
        </Poll>
    );
}
