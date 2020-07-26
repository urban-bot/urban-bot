import React from 'react';
import { getRandomId } from './getRandomId';
import { Button, ButtonProps } from '../components/ButtonGroup';
import { OtherProps } from '../types/common';
import { isArrayMatrix } from './isArrayMatrix';

export type FormattedButton = OtherProps & {
    id: string;
    text: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};

export type ButtonElement = React.ReactElement<ButtonProps> | boolean | null | undefined;

export function formatButtonElement(
    element: ButtonElement | ButtonElement[] | ButtonElement[][],
): FormattedButton[] | FormattedButton[][] {
    if (isArrayMatrix(element)) {
        return element.map(formatButtonFlatArray);
    }

    return formatButtonFlatArray(element);
}

function formatButtonFlatArray(element: ButtonElement | ButtonElement[]): FormattedButton[] {
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
