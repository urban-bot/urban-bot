import React, { useEffect, useState } from 'react';
import { matchPattern } from '../../utils/matchPattern';
import { Text } from '../Text';
import { useAction, useDialog, useText } from '../..';

export type DialogValidationResult = string | void | Promise<string | void>;

export type DialogValidation = (answer: string) => DialogValidationResult;

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
    const { onFinish, finishedContent, addAnswer } = useDialog();

    useEffect(() => {
        if (childrenArray.length === 0 && isAnswered && typeof children !== 'function') {
            // TODO call onFinish not inside useEffects
            onFinish();
            setDisplayedContent(finishedContent);
        }
    }, [childrenArray.length, isAnswered, finishedContent, onFinish, children]);

    async function handler(text: string) {
        if (isAnswered) {
            return;
        }

        const matchedChild = childrenArray.find(
            (child) => child.props.match === undefined || matchPattern(text, child.props.match),
        );

        if (validation !== undefined) {
            const validationError = await validation(text);

            if (validationError) {
                setDisplayedContent(<Text isNewMessageEveryRender>{validationError}</Text>);

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
            setDisplayedContent(await children(text));

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
