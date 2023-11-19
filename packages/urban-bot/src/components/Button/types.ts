import type { ReactNode } from 'react';
import type { ButtonElement, OtherProps, UrbanButtonStyle, UrbanMessageCommonData } from '../../types';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: ReactNode;
    isReplyButtons?: boolean;
    isResizedKeyboard?: boolean;
    disableWebPagePreview?: boolean;
    isNewMessageEveryRender?: boolean;
    maxColumns?: number;
    children: ButtonElement | ButtonElement[] | ButtonElement[][];
};

export type ButtonProps = OtherProps & {
    id?: string;
    children: string;
    style?: UrbanButtonStyle;
    url?: string;
    webApp?: { url: string };
    phoneNumber?: string | number;
    isDisabled?: boolean;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};
