import React, { ReactNode, useEffect, useState } from 'react';
import { matchPattern } from '../../utils/matchPattern';
import { Text } from '../Text';
import { useAction, useDialog, useText } from '../..';

export type DialogValidation = (answer: string) => ReactNode;

export type DialogStepProps = {
    children?: ((answer: string) => React.ReactNode) | React.ReactNode;
    match?: string | RegExp;
    content: React.ReactNode;
    id?: string;
    onNext?: (answer: string) => void;
    validation?: DialogValidation;
    type?: 'checkbox';
};

export function DialogStep({ children, content, id, onNext, validation, type }: DialogStepProps) {
    const [checkboxes, setCheckboxes] = useState(new Set<string>());
    const [isAnswered, setIsAnswered] = useState(false);
    const childrenArray = React.Children.toArray(children as ReactNode) as React.ReactElement<DialogStepProps>[];
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

            if (typeof validationError === 'string') {
                setDisplayedContent(<Text isNewMessageEveryRender>{validationError}</Text>);

                return;
            }

            if (React.isValidElement(validationError)) {
                return setDisplayedContent(validationError);
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
    useAction(({ actionId }) => {
        if (type !== 'checkbox') {
            handler(actionId);
            return;
        }

        if (actionId === 'checkbox-next') {
            handler(String(Array.from(checkboxes)));
        } else {
            setCheckboxes((prevCheckboxes) => {
                const newCheckboxes = new Set(prevCheckboxes);

                if (newCheckboxes.has(actionId)) {
                    newCheckboxes.delete(actionId);
                } else {
                    newCheckboxes.add(actionId);
                }

                return newCheckboxes;
            });
        }
    });

    return <>{displayedContent}</>;
}
