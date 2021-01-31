import React, { useCallback, useContext, useState } from 'react';

export type DialogProps = {
    children?: React.ReactNode;
    onFinish?: (answers: DialogAnswers) => void;
    finishedContent?: React.ReactNode;
};

export type DialogAnswers = {
    [id: string]: string;
};

export type DialogAddAnswer = (id: string, answer: string) => void;

export type DialogContextType = {
    onFinish: () => void;
    finishedContent?: React.ReactNode;
    addAnswer: DialogAddAnswer;
};

const DialogContext = React.createContext<DialogContextType>({} as DialogContextType);

export function useDialog() {
    return useContext(DialogContext);
}

export function Dialog({ children, onFinish, finishedContent }: DialogProps) {
    const [answers, setAnswers] = useState<DialogAnswers>({});
    const onFinishCallback = useCallback(() => {
        onFinish?.(answers);
    }, [answers, onFinish]);

    const addAnswer: DialogAddAnswer = (id, answer) => {
        setAnswers({ ...answers, [id]: answer });
    };

    return (
        <DialogContext.Provider value={{ onFinish: onFinishCallback, finishedContent, addAnswer }}>
            {children}
        </DialogContext.Provider>
    );
}
