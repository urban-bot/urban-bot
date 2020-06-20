import React, { useState } from 'react';
import { GetAnswers, GetAnswersMap, GetAnswersProps, GetAnswersQuestion, Text } from '@urban-bot/core';

const questions: GetAnswersQuestion[] = [
    {
        key: 'name',
        question: "What's your name?",
    },
    {
        key: 'age',
        question: "What's your age?",
        isValid(answer) {
            const number = Number(answer);

            return !Number.isNaN(number);
        },
        errorText: 'Please enter a number',
    },
];

export function GetAnswersExample() {
    const [answers, setAnswers] = useState<GetAnswersMap>({});

    const handleAnswer: GetAnswersProps['onEveryAnswer'] = (key, answer) => {
        console.log(`User answer ${key} is ${answer}`);
    };

    const answersArray = Object.entries(answers);

    if (answersArray.length === 0) {
        return (
            <GetAnswers
                questions={questions}
                onEveryAnswer={handleAnswer}
                onFinish={(answers) => {
                    setAnswers(answers);
                }}
            />
        );
    }

    return (
        <Text>
            {answersArray.map(([key, answer]) => {
                return (
                    <React.Fragment key={key}>
                        {key} - {answer}
                        <br />
                    </React.Fragment>
                );
            })}
        </Text>
    );
}
