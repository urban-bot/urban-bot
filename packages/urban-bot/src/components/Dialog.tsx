import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useText } from '../hooks/useText';
import { useAction } from '../hooks/hooks';
import { matchPattern } from '../utils/matchPattern';
import { Text } from './Text';

export type DialogProps = {
    children?: React.ReactNode;
    onFinish?: (answers: DialogAnswers) => void;
    finishedContent?: React.ReactNode;
    defaultErrorText?: string;
};

export type DialogAnswers = {
    [id: string]: string;
};

export type DialogAddAnswer = (id: string, answer: string) => void;

export type DialogContextType = {
    onFinish: () => void;
    finishedContent?: React.ReactNode;
    addAnswer: DialogAddAnswer;
    defaultErrorText: string;
};

const DialogContext = React.createContext<DialogContextType>({} as DialogContextType);

export function useDialog() {
    return useContext(DialogContext);
}

export function Dialog({ children, onFinish, finishedContent, defaultErrorText = 'Not valid answer.' }: DialogProps) {
    const [answers, setAnswers] = useState<DialogAnswers>({});
    const onFinishCallback = useCallback(() => {
        onFinish?.(answers);
    }, [answers, onFinish]);

    const addAnswer: DialogAddAnswer = (id, answer) => {
        setAnswers({ ...answers, [id]: answer });
    };

    return (
        <DialogContext.Provider value={{ onFinish: onFinishCallback, finishedContent, addAnswer, defaultErrorText }}>
            {children}
        </DialogContext.Provider>
    );
}

export type DialogValidation = {
    isValid: (answer: string) => boolean;
    errorText?: string;
};

export type DialogStepProps = {
    children?: ((answer: string) => React.ReactNode) | React.ReactNode;
    match?: string | RegExp;
    content: React.ReactNode;
    id?: string;
    onNext?: (answer: string) => void;
    validation?: DialogValidation;
};

export function DialogStep({ children, content, id, onNext, validation }: DialogStepProps) {
    const [isAnswered, setIsAnswered] = useState(false);
    const childrenArray = React.Children.toArray(children) as React.ReactElement<DialogStepProps>[];
    const [displayedContent, setDisplayedContent] = useState(content);
    const { onFinish, finishedContent, addAnswer, defaultErrorText } = useDialog();

    useEffect(() => {
        if (childrenArray.length === 0 && isAnswered && typeof children !== 'function') {
            onFinish();
            setDisplayedContent(finishedContent);
        }
    }, [childrenArray.length, isAnswered, finishedContent, onFinish, children]);

    function handler(text: string) {
        if (isAnswered) {
            return;
        }

        const matchedChild = childrenArray.find(
            (child) => child.props.match === undefined || matchPattern(text, child.props.match),
        );

        if (validation !== undefined) {
            const isValid = validation.isValid(text);

            if (!isValid) {
                setDisplayedContent(<Text isNewMessageEveryRender>{validation.errorText ?? defaultErrorText}</Text>);

                return;
            }
        }

        if (childrenArray.length === 0 || matchedChild !== undefined || typeof children === 'function') {
            if (id !== undefined) {
                addAnswer(id, text);
            }

            setIsAnswered(true);
            onNext?.(text);
        }

        if (typeof children === 'function') {
            setDisplayedContent(children(text));

            return;
        }

        if (matchedChild !== undefined) {
            setDisplayedContent(matchedChild);
        }
    }

    useText(({ text }) => handler(text));
    useAction(({ actionId }) => handler(actionId));

    return <>{displayedContent}</>;
}
