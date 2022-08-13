import React from 'react';
import { useBotContext, useAction } from '../hooks/hooks';
import { ButtonElement, formatButtonElement } from '../utils/formatButtonElement';
import { UrbanButtonStyle, UrbanMessageCommonData } from '../types/Messages';
import { OtherProps } from '../types/common';
import { flatten } from 'array-flatten';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';
import { groupFlatArray } from '../utils/groupFlatArray';
import { isArrayMatrix } from '../utils/isArrayMatrix';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: React.ReactNode;
    isReplyButtons?: boolean;
    isResizedKeyboard?: boolean;
    isNewMessageEveryRender?: boolean;
    maxColumns?: number;
    children: ButtonElement | ButtonElement[] | ButtonElement[][];
};

export function ButtonGroup({
    children,
    title,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    maxColumns,
    isReplyButtons = false,
    ...otherProps
}: ButtonGroupProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
        bot,
    } = useBotContext();
    let buttons = formatButtonElement(children);

    if (typeof maxColumns === 'number') {
        if (!isArrayMatrix(buttons)) {
            buttons = groupFlatArray(buttons, maxColumns);
        } else {
            console.error('When you use "maxColumns" the buttons children must be flatten array');
        }
    }

    const finalParseMode = getParseMode(title, parseMode, parseModeContext, bot.defaultParseMode);
    const formattedTitle = formatMarkupLanguageElement(title, finalParseMode);

    useAction((ctx) => {
        const { actionId } = ctx;

        const button = flatten(buttons).find(({ id }) => {
            return actionId === id;
        });

        button?.onClick?.(ctx);
    });

    return (
        <urban-buttons
            chat={chat}
            $$managerBot={$$managerBot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons,
                title: formattedTitle,
                isReplyButtons,
                ...otherProps,
            }}
        />
    );
}

export type ButtonProps = OtherProps & {
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
    children: string;
    id?: string;
    url?: string;
    webApp?: {
        url: string;
    };
    phoneNumber?: string | number;
    style?: UrbanButtonStyle;
    isDisabled?: boolean;
};

export function Button(_props: ButtonProps) {
    return null;
}
