import React from 'react';
import { useBotContext, useAction } from '../hooks/hooks';
import { formatButtonElement, FormattedButton } from '../utils/formatButtonElement';
import { UrbanMessageCommonData } from '../types/Messages';
import { OtherProps } from '../types/common';
import { flatten } from 'array-flatten';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';
import { groupFlatArray } from '../utils/groupFlatArray';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: React.ReactNode;
    isReplyButtons?: boolean;
    isResizedKeyboard?: boolean;
    isNewMessageEveryRender?: boolean;
    maxColumns?: number;
    children: React.ReactNode;
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

    const buttonElements = React.Children.toArray(children).filter(React.isValidElement) as
        | React.ReactElement<ButtonProps>
        | React.ReactElement<ButtonProps>[]
        | React.ReactElement<ButtonProps>[][];

    let buttons = formatButtonElement(buttonElements);

    if (typeof maxColumns === 'number' && !Array.isArray(buttons[0])) {
        buttons = groupFlatArray(buttons as FormattedButton[], maxColumns);
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
    phoneNumber?: string | number;
};

export function Button(_props: ButtonProps) {
    return null;
}
