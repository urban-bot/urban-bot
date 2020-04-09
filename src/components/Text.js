import React from 'react';
import { useBotContext } from '../hooks';
import { formatElementToHTML } from '../utils/formatElementToHTML';

export function Text({
    children,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    forceReply,
}) {
    const { userId, bot, isNewMessageEveryRender: isNewMessageEveryRenderContext } = useBotContext();

    let text;
    if (typeof children !== 'string') {
        parseMode = 'HTML';

        text = formatElementToHTML(children);
    } else {
        text = children;
    }

    return (
        <text
            text={text}
            userId={userId}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            params={{
                parse_mode: parseMode,
                disable_web_page_preview: disableWebPagePreview,
                disable_notification: disableNotification,
                reply_to_message_id: replyToMessageId,
                reply_markup: {
                    force_reply: forceReply,
                },
            }}
        />
    );
}
