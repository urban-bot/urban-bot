import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormatElement } from '../hooks/useFormatElement';
import { UrbanMessageCommonData, UrbanMessageTextData } from '../types/Messages';

export type TextProps = UrbanMessageCommonData & {
    disableWebPagePreview?: boolean;
    children: React.ReactNode;
    isNewMessageEveryRender?: boolean;
};

export function Text({
    children,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    forceReply,
    ...otherProps
}: TextProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedText, finalParseMode] = useFormatElement(children, parseMode);

    return (
        <urban-text
            chat={chat}
            $$managerBot={$$managerBot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                disableWebPagePreview,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                text: formattedText,
                ...otherProps,
            }}
        />
    );
}
