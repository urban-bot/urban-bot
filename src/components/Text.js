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

    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
    } = useBotContext();

    let parseMode = parseModeProp ?? parseModeContext;
    let text = children;

    if (typeof children !== 'string' && typeof children !== 'number') {
        parseMode = parseMode ?? 'HTML';
        text = formatHTMLElement(children, parseMode);
    }

    return (
        <text
            chat={chat}
            $$managerBot={$$managerBot}
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
