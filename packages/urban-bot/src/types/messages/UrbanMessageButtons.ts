import type { ReactElement } from 'react';
import type { ButtonProps } from '../../components';
import type { OtherProps } from '../common';
import type { UrbanMessageCommon, UrbanMessageCommonData } from './UrbanMessageCommon';

export type UrbanButtonStyle = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
export type ButtonElement = ReactElement<ButtonProps> | boolean | null | undefined;

export type UrbanButton = OtherProps & {
    text: string;
    id?: string;
    url?: string;
    phoneNumber?: string | number;
    webApp?: { url: string };
    style?: UrbanButtonStyle;
    isDisabled?: boolean;
};

export type UrbanMessageButtonsData = UrbanMessageCommonData & {
    title: string;
    buttons: UrbanButton[] | UrbanButton[][];
    isReplyButtons: boolean;
    isResizedKeyboard?: boolean;
};

export type UrbanMessageButtons = UrbanMessageCommon & {
    nodeName: 'urban-buttons';
    data: UrbanMessageButtonsData;
};
