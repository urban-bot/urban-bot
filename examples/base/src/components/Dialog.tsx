import React, { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogStep, Text } from '@urban-bot/core';
import type { DialogAnswers, DialogValidation } from '@urban-bot/core';

export function FlatDialogExample() {
    const [answers, setAnswers] = useState<DialogAnswers>();

    const handleFinishDialog = (answers: DialogAnswers) => setAnswers(answers);

    const textAnswers = JSON.stringify(answers, undefined, 2);
    const finishedContent = <Text isNewMessageEveryRender>Your answers: {textAnswers}</Text>;
    const nameContent = <Text>{"Hi, what's your name?"}</Text>;
    const ageContent = <Text>{"What's your age?"}</Text>;
    const cityContent = <Text>{"What's your city?"}</Text>;

    return (
        <Dialog onFinish={handleFinishDialog} finishedContent={finishedContent}>
            <DialogStep id="name" content={nameContent} onNext={(name) => console.log(name)}>
                <DialogStep id="age" content={ageContent}>
                    <DialogStep id="city" content={cityContent} />
                </DialogStep>
            </DialogStep>
        </Dialog>
    );
}

type DialogButtonsProps = {
    match: string;
    product: string;
};

function DialogButtons({ product }: DialogButtonsProps) {
    const colorContent = (
        <ButtonGroup title="Please choose color">
            <Button id="blue">Blue</Button>
            <Button id="red">Red</Button>
        </ButtonGroup>
    );

    const blueColorContent = <Text>You have chosen Blue {product}.</Text>;
    const redColorContent = <Text>You have chosen Red {product}.</Text>;

    return (
        <DialogStep content={colorContent}>
            <DialogStep match="blue" content={blueColorContent} />
            <DialogStep match="red" content={redColorContent} />
        </DialogStep>
    );
}

const getTrimLowerName = (name: string) => name.trim().toLowerCase();

const isValidName: DialogValidation = (name) => {
    const checkingName = getTrimLowerName(name);

    if (checkingName === 'samuel') {
        return 'Samuel is blocked';
    }

    if (checkingName === 'bubba') {
        return (
            <Text isNewMessageEveryRender>
                It <b>is not</b> real name
                <br />
                <br />
                You <b>have to</b> enter existed name!
            </Text>
        );
    }
};

export function TreeDialogExample() {
    const nameContent = <Text>{"What's your name?"}</Text>;

    return (
        <Dialog>
            <DialogStep validation={isValidName} content={nameContent}>
                {(name) => {
                    const buyingContent = (
                        <ButtonGroup title={`Hi, ${name}. What do you want to buy?`}>
                            <Button id="hat">Hat</Button>
                            <Button id="glasses">Glasses</Button>
                        </ButtonGroup>
                    );

                    return (
                        <DialogStep content={buyingContent}>
                            <DialogButtons match="hat" product="Hat" />
                            <DialogButtons match="glasses" product="Glasses" />
                        </DialogStep>
                    );
                }}
            </DialogStep>
        </Dialog>
    );
}
