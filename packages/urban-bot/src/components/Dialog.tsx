import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useText } from '../hooks/useText';
import { useAction } from '../hooks/hooks';

export type DialogProps = {
    children?: React.ReactNode;
    onFinish?: () => void;
    finishContent?: React.ReactNode;
};

export type DialogContextType = {
    onFinish: () => void;
    finishContent?: React.ReactNode;
};

const DialogContext = React.createContext<DialogContextType>({} as DialogContextType);

export function useDialog() {
    return useContext(DialogContext);
}

export function Dialog({ children, onFinish, finishContent }: DialogProps) {
    const onFinishCallback = useCallback(onFinish ?? (() => {}), [onFinish]);

    return (
        <DialogContext.Provider value={{ onFinish: onFinishCallback, finishContent }}>
            {children}
        </DialogContext.Provider>
    );
}

export type DialogStepProps = {
    children?: React.ReactNode;
    match?: string;
    content: React.ReactNode;
    id?: string;
};

export function DialogStep({ children, content }: DialogStepProps) {
    const [isAnswered, setIsAnswered] = useState(false);
    const childrenArray = React.Children.toArray(children) as React.ReactElement<DialogStepProps>[];
    const [displayedContent, setDisplayedContent] = useState(content);
    const { onFinish, finishContent } = useDialog();

    useEffect(() => {
        console.log(childrenArray.length === 0, isAnswered);
        if (childrenArray.length === 0 && isAnswered) {
            onFinish();
            setDisplayedContent(finishContent);
        }
    }, [childrenArray.length, isAnswered]);

    useText(({ text }) => {
        const matchedChild = childrenArray.find(
            (child) => child.props.match === text || child.props.match === undefined,
        );

        setIsAnswered(true);

        if (matchedChild === undefined) {
            return;
        }

        setDisplayedContent(matchedChild);
    });

    useAction(({ actionId }) => {
        const matchedChild = childrenArray.find((child) => child.props.match === actionId);

        setIsAnswered(true);

        if (matchedChild === undefined) {
            return;
        }

        setDisplayedContent(matchedChild);
    });

    return <>{displayedContent}</>;
}
