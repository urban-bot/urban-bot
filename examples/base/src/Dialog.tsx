import React, { useState } from 'react';
import { DialogAnswers, Button, ButtonGroup, Dialog, DialogStep, Text } from '@urban-bot/core';

export function FlatDialogExample() {
    const [answers, setAnswers] = useState<DialogAnswers>();

    return (
        <Dialog
            onFinish={(answers) => setAnswers(answers)}
            finishedContent={<Text isNewMessageEveryRender>Your answers: {JSON.stringify(answers)}</Text>}
        >
            <DialogStep onNext={(name) => console.log(name)} id="name" content={<Text>{"Hi, what's your name?"}</Text>}>
                <DialogStep id="age" content={<Text>{"What's your age?"}</Text>}>
                    <DialogStep id="city" content={<Text>{"What's your city?"}</Text>} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}

export function TreeDialogExample() {
    return (
        <Dialog onFinish={(answers) => console.log(answers)} finishedContent={<Text>Thanks!</Text>}>
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
                    <DialogStep match="red" content={<Text>You like red!</Text>} />
                    <DialogStep match="green" content={<Text>You like green!</Text>} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}
