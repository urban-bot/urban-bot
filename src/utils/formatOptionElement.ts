import React from 'react';
import { OtherProps } from '../types/common';
import { Option, OptionProps } from '../components/Poll';
import { getRandomId } from './getRandomId';

type FormattedOption = OtherProps & {
    text: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
    id: string;
};

// TODO combine with formatButtonElement?
export function formatOptionElement(
    element: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[],
): FormattedOption[] {
    return React.Children.map(element, (child) => {
        if (child.type !== Option) {
            throw new Error('Please use only Button components inside ButtonGroup.');
        }

        const { children: text, onClick, id = getRandomId(), ...other } = child.props;

        return { text, onClick, id, ...other };
    });
}
