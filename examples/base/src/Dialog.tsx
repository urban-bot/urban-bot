import React, { useState } from 'react';
import { DialogAnswers, Button, ButtonGroup, Dialog, DialogStep, Text } from '@urban-bot/core';

export function FlatDialogExample() {
    const [answers, setAnswers] = useState<DialogAnswers>();

    return (
        <Dialog
            onFinish={(answers) => setAnswers(answers)}
            finishedContent={<Text isNewMessageEveryRender>Your answers: {JSON.stringify(answers)}</Text>}
        >
            <DialogStep id="name" content={<Text>{"Hi, what's your name?"}</Text>} onNext={(name) => console.log(name)}>
                <DialogStep id="age" content={<Text>{"What's your age?"}</Text>}>
                    <DialogStep id="city" content={<Text>{"What's your city?"}</Text>} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}

type DialogButtonsProps = {
    match: string;
    name: string;
};

function DialogButtons({ name }: DialogButtonsProps) {
    return (
        <DialogStep
            content={
                <ButtonGroup title="Please choose color">
                    <Button id="blue">Blue</Button>
                    <Button id="red">Red</Button>
                </ButtonGroup>
            }
        >
            <DialogStep match="blue" content={<Text>You have chosen Blue {name}.</Text>} />
            <DialogStep match="red" content={<Text>You have chosen Red {name}.</Text>} />
        </DialogStep>
    );
}

export function TreeDialogExample() {
    return (
        <Dialog>
            <DialogStep id="name" content={<Text>{"What's your name?"}</Text>}>
                {(name) => {
                    return (
                        <DialogStep
                            content={
                                <ButtonGroup title={`Hi, ${name}. What do you want to buy?`}>
                                    <Button id="hat">Hat</Button>
                                    <Button id="glasses">Glasses</Button>
                                </ButtonGroup>
                            }
                        >
                            <DialogButtons match="hat" name="Hat" />
                            <DialogButtons match="glasses" name="Glasses" />
                        </DialogStep>
                    );
                }}
            </DialogStep>
        </Dialog>
    );
}
