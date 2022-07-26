import { Button, ButtonGroup, Dialog, DialogAnswers, DialogStep, Text } from '@urban-bot/core';
import React, { useState } from 'react';

function Checkboxes() {
    const [checkboxes, setCheckboxes] = useState(new Set());

    function toggleCheckboxes(id: string) {
        setCheckboxes((prevCheckboxes) => {
            const newCheckboxes = new Set(prevCheckboxes);

            if (newCheckboxes.has(id)) {
                newCheckboxes.delete(id);
            } else {
                newCheckboxes.add(id);
            }

            return newCheckboxes;
        });
    }

    function getButtonText(id: string, text: string) {
        return checkboxes.has(id) ? `✔️ ${text}` : text;
    }

    return (
        <ButtonGroup title="Choose your favorite colors">
            <Button id="red" onClick={() => toggleCheckboxes('red')}>
                {getButtonText('red', 'Red')}
            </Button>
            <Button id="green" onClick={() => toggleCheckboxes('green')}>
                {getButtonText('green', 'Green')}
            </Button>
            <Button id="blue" onClick={() => toggleCheckboxes('blue')}>
                {getButtonText('blue', 'Blue')}
            </Button>
            <Button id="checkbox-next">Next</Button>
        </ButtonGroup>
    );
}

export function CheckboxDialogExample() {
    const [answers, setAnswers] = useState<DialogAnswers>();

    return (
        <Dialog
            onFinish={(answers) => setAnswers(answers)}
            finishedContent={<Text isNewMessageEveryRender>Your answers: {JSON.stringify(answers)}</Text>}
        >
            <DialogStep id="name" content={<Text>{"Hi, what's your name?"}</Text>}>
                <DialogStep id="colors" type="checkbox" content={<Checkboxes />} />
            </DialogStep>
        </Dialog>
    );
}
