import type { ReactNode } from 'react';

export type DialogProps = {
    children?: ReactNode;
    finishedContent?: ReactNode;
    onFinish?: (answers: DialogAnswers) => void;
};

export type DialogAnswers = {
    [id: string]: string;
};

export type DialogAddAnswer = (id: string, answer: string) => void;

export type DialogContextType = {
    onFinish: () => void;
    finishedContent?: ReactNode;
    addAnswer: DialogAddAnswer;
};

export type DialogValidation = (answer: string) => ReactNode;

export type DialogStepProps = {
    id?: string;
    children?: ((answer: string) => ReactNode) | ReactNode;
    content: ReactNode;
    match?: string | RegExp;
    validation?: DialogValidation;
    type?: 'checkbox';
    onNext?: (answer: string) => void;
};
