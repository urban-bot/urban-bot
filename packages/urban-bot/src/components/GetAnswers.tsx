import React, { useState } from 'react';
import { Text, TextProps } from './Text';
import { useText } from '../hooks/useText';

export type GetAnswersMap = {
    [key: string]: string;
};

export type GetAnswersQuestion = {
    question: string;
    key: string;
    isValid?: (answer: string) => boolean;
    errorText?: string;
};

export type GetAnswersProps = {
    questions: GetAnswersQuestion[];
    onFinish?: (answers: GetAnswersMap) => void;
    onEveryAnswer?: (key: string, answer: string) => void;
    textProps?: Partial<TextProps>;
    defaultErrorText?: string;
};

export function GetAnswers({
    questions,
    onFinish,
    textProps = {},
    defaultErrorText = 'Not valid answer. Please repeat.',
    onEveryAnswer,
}: GetAnswersProps) {
    const [isAnswerValid, setIsAnswerValid] = useState(true);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<GetAnswersMap>({});

    const activeQuestion = questions[activeQuestionIndex];

    useText(({ text }) => {
        const isValid = activeQuestion.isValid ?? (() => true);

        if (isValid(text)) {
            onEveryAnswer?.(activeQuestion.key, text);

            const newAnswers = { ...answers, [activeQuestion.key]: text };

            if (activeQuestionIndex === questions.length - 1) {
                onFinish?.(newAnswers);

                return;
            }

            setAnswers(newAnswers);
            setActiveQuestionIndex((index) => index + 1);
            setIsAnswerValid(true);
        } else {
            setIsAnswerValid(false);
        }
    });

    const errorText = activeQuestion.errorText ?? defaultErrorText;
    const content = isAnswerValid ? activeQuestion.question : errorText;

    return (
        <Text isNewMessageEveryRender {...textProps}>
            {content}
        </Text>
    );
}
