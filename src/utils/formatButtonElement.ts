import React from 'react';
import { getRandomId } from './getRandomId';
import { Button, ButtonProps } from '../components/ButtonGroup';

type FormattedButton = Omit<ButtonProps, 'children'> & {
    id: string;
    text: string;
};

export function formatButtonElement(
    element: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[],
): FormattedButton[] {
    return React.Children.map(element, (child) => {
        if (child.type !== Button) {
            throw new Error('Please use only Button components inside ButtonGroup.');
        }

        const { children: text, onClick, id = getRandomId(), ...other } = child.props;

        return { text, onClick, id, ...other };
    });
}
