import React from 'react';
import { getRandomId } from './getRandomId';
import { Button, ButtonProps } from '../components/ButtonGroup';
import { OtherProps } from '../types/common';

type FormattedButton = OtherProps & {
    id: string;
    text: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};

export function formatButtonElement(
    element: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[] | React.ReactElement<ButtonProps>[][],
): FormattedButton[] | FormattedButton[][] {
    if (Array.isArray(element) && Array.isArray(element[0])) {
        const elementGuard = element as React.ReactElement<ButtonProps>[][];

        return elementGuard.map((elem) => formatButtonElement(elem)) as FormattedButton[][];
    }

    const elementGuard = element as React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[];

    return React.Children.map(elementGuard, (child) => {
        if (child.type !== Button) {
            throw new Error('Please use only Button components inside ButtonGroup.');
        }

        const { children: text, onClick, id = getRandomId(), ...other } = child.props;

        return { text, onClick, id, ...other };
    });
}
