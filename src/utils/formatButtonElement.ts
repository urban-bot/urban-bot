import React from 'react';
import { Button } from '../components/ButtonGroup';
import { getRandomId } from './getRandomId';
import { OtherProps } from '../types';

type ButtonProps = {
    onClick: Function;
    children: string;
    id?: string;
} & OtherProps;

type FormattedButton = Omit<ButtonProps, 'children'> & {
    id: string;
    text: string;
};

export function formatButtonElement(
    element: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[],
): FormattedButton[] {
    const mockCallback = () => {};

    return React.Children.map(element, (child) => {
        if (child.type !== Button) {
            throw new Error('Please use only Button components inside ButtonGroup.');
        }

        const { children: text, onClick = mockCallback, id = getRandomId(), ...other } = child.props;

        return { text, onClick, id, ...other };
    });
}
