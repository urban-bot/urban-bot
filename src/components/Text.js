import React from 'react';
import { useBotContext } from '../dist/hooks/hooks';
import { useFormatElement } from '../hooks/useFormatElement';

export function Text(props) {
    const {
        children,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode,
        disableWebPagePreview,
        disableNotification,
        replyToMessageId,
        forceReply,
        ...otherProps
    } = props;

    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedText, finalParseMode] = useFormatElement(children, parseMode);

    return (
        <text
            chat={chat}
            $$managerBot={$$managerBot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            text={formattedText}
            parseMode={finalParseMode}
            disableWebPagePreview={disableWebPagePreview}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}
