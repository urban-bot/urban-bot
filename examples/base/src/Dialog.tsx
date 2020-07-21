import React from 'react';
import { Button, ButtonGroup, Dialog, DialogStep, Text } from '@urban-bot/core';

export function FlatDialogExample() {
    return (
        <Dialog finishContent={<Text>Thanks for answers!</Text>}>
            <DialogStep id="name" content={<Text>{"Hi, what's your name?"}</Text>}>
                <DialogStep content={<Text>{"What's your age?"}</Text>}>
                    <DialogStep content={<Text>{"What's your city?"}</Text>} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}

export function TreeDialogExample() {
    return (
        <Dialog onFinish={() => console.log('Finish')} finishContent={<Text>Thanks!</Text>}>
            <DialogStep content={<Text>Hi! Whats your name?</Text>}>
                <DialogStep match="German" content={<Text>Hi, German</Text>} />
                <DialogStep match="Kamola" content={<Text>Hi, Kamola</Text>} />
                <DialogStep
                    match="Color"
                    content={
                        <ButtonGroup title="Which your favorite color?">
                            <Button id="red">Red</Button>
                            <Button id="green">Green</Button>
                        </ButtonGroup>
                    }
                >
                    <DialogStep match="red" content={<Text>{'You like red!'}</Text>} />
                    <DialogStep match="green" content={<Text>{'You like green!'}</Text>} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}
