import React from 'react';
import { useBotContext, useAction } from '../hooks/hooks';
import { formatButtonElement } from '../utils/formatButtonElement';
import { UrbanMessageCommonData } from '../types/Messages';
import { OtherProps } from '../types/common';
import { flatten } from 'array-flatten';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';

export type ButtonGroupProps = UrbanMessageCommonData & {
    title?: React.ReactNode;
    isReplyButtons?: boolean;
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

    const buttons = formatButtonElement(children);

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
};

export function Button(_props: ButtonProps) {
    return null;
}
