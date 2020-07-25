import React from 'react';
import { getRandomId } from './getRandomId';
import { Button, ButtonProps } from '../components/ButtonGroup';
import { OtherProps } from '../types/common';

export type FormattedButton = OtherProps & {
    id: string;
    text: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};

export type ButtonsElement = React.ReactElement<ButtonProps> | boolean | null | undefined;

function isButtonMatrix(
    buttons: ButtonsElement | ButtonsElement[] | ButtonsElement[][],
): buttons is ButtonsElement[][] {
    return Array.isArray(buttons) && Array.isArray(buttons[0]);
}

export function formatButtonElement(
    element: ButtonsElement | ButtonsElement[] | ButtonsElement[][],
): FormattedButton[] | FormattedButton[][] {
    if (isButtonMatrix(element)) {
        return element.map(formatButtonFlatArray);
    }

    return formatButtonFlatArray(element);
}

function formatButtonFlatArray(element: ButtonsElement | ButtonsElement[]): FormattedButton[] {
    return React.Children.toArray(element)
        .filter<React.ReactElement<ButtonProps>>(React.isValidElement)
        .map((child) => {
            if (child.type !== Button) {
                throw new Error('Please use only Button components inside ButtonGroup.');
            }

            const { children: text, onClick, id = getRandomId(), ...other } = child.props;

            return { text, onClick, id, ...other };
        });
}
