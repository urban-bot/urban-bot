import { useEffect, useState, isValidElement, Children } from 'react';
import { useAction } from '../../hooks';
import { useText } from '../../hooks/useText';
import { matchPattern } from '../../utils/matchPattern';
import { Text } from '../Text';
import { useDialog } from './Dialog';
import type { ReactNode, ReactElement } from 'react';
import type { DialogStepProps } from './types';

export function DialogStep({ children, content, id, onNext, validation, type }: DialogStepProps) {
    const [checkboxes, setCheckboxes] = useState(new Set<string>());
    const [isAnswered, setIsAnswered] = useState(false);
    const [displayedContent, setDisplayedContent] = useState(content);
    const childrenArray = Children.toArray(children as ReactNode) as ReactElement<DialogStepProps>[];
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

            if (isValidElement(validationError)) {
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
