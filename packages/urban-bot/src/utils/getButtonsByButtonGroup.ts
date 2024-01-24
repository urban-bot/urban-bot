import React from 'react';
import { ButtonGroup } from '../components/Button/ButtonGroup';
import type { ButtonGroupProps } from '../components/Button/types';
import type { UrbanElementButtons } from '../global.d';

export function getButtonsByButtonGroup(
    buttonGroupElement: React.FunctionComponentElement<ButtonGroupProps> | undefined,
) {
    if (buttonGroupElement === undefined) {
        return undefined;
    }
    if (!React.Children.only(buttonGroupElement) && buttonGroupElement.type !== ButtonGroup) {
        throw new Error('Pass only one ButtonGroup component to buttons');
    }

    const buttonsElementChildren = buttonGroupElement.type(buttonGroupElement.props);

    if (buttonsElementChildren === null) {
        throw new Error('ButtonGroup component should return children');
    }

    const { data } = buttonsElementChildren.props as UrbanElementButtons;

    return data.buttons;
}
