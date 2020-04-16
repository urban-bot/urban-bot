import React from 'react';
import { useBotContext } from '../hooks';
import { formatHTMLElement } from '../utils/formatHTMLElement';

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

    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let text = children;
    if (typeof children !== 'string' && typeof children !== 'number') {
        text = formatHTMLElement(children, parseMode);
    }

    return (
        <text
            chat={chat}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            text={text}
            parseMode={parseMode}
            disableWebPagePreview={disableWebPagePreview}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}
