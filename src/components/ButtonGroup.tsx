import React from 'react';
import { useBotContext, useAction } from '../hooks/hooks';
import { formatButtonElement } from '../utils/formatButtonElement';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { OtherProps } from '../types/common';
import { flatten } from 'array-flatten';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: React.ReactNode;
    isReply?: boolean;
    isNewMessageEveryRender?: boolean;
    children: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[] | React.ReactElement<ButtonProps>[][];
};

export function ButtonGroup({
    children,
    title,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    isReply = false,
    ...otherProps
}: ButtonGroupProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const buttons = formatButtonElement(children);
    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);

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
                isReply,
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
};

export function Button(_props: ButtonProps) {
    return null;
}
