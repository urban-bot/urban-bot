import React from 'react';
import { useBotContext, useAction } from '../hooks/hooks';
import { formatButtonElement } from '../utils/formatButtonElement';
import { useFormatElement } from '../hooks/useFormatElement';
import { UrbanMessageCommonData } from '../types/Messages';
import { OtherProps } from '../types/common';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: React.ReactNode;
    isNewMessageEveryRender?: boolean;
    children: React.ReactElement<ButtonProps> | React.ReactElement<ButtonProps>[];
};

export function ButtonGroup({
    children,
    title,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    ...otherProps
}: ButtonGroupProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const buttons = formatButtonElement(children);
    const [formattedTitle, finalParseMode] = useFormatElement(title, parseMode);

    useAction((ctx) => {
        const { actionId } = ctx.payload;

        const button = buttons.find(({ id }) => {
            return actionId === id;
        });

        button?.onClick(ctx);
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
                ...otherProps,
            }}
        />
    );
}

export type ButtonProps = OtherProps & {
    // FIXME describe type for onClick?
    onClick: (...args: unknown[]) => unknown;
    children: string;
    id?: string;
};

export function Button(_props: ButtonProps) {
    return null;
}
