import React from 'react';
import { Button } from '../components';
import { isArrayMatrix } from './isArrayMatrix';
import { getRandomId } from './getRandomId';
import type { ButtonProps } from '../components';
import type { OtherProps, ButtonElement } from '../types';

export type FormattedButton = OtherProps & {
    id: string;
    text: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};

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
