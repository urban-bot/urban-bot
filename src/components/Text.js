import React from 'react';
import { useBotContext } from '../hooks';
import { formatHTMLElement } from '../utils/formatHTMLElement';

export function Text(props) {
    const {
        children,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode: parseModeProp,
        disableWebPagePreview,
        disableNotification,
        replyToMessageId,
        forceReply,
        ...otherProps
    } = props;

    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let parseMode = parseModeProp;
    let text = children;
    if (typeof children !== 'string' && typeof children !== 'number') {
        parseMode = 'HTML';
        text = formatHTMLElement(children);
    }

    return (
        <text
            chatId={chat.id}
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
