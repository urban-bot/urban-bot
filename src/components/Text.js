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
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let text;
    if (typeof children === 'string' || typeof children === 'number') {
        text = children;
    } else {
        parseMode = 'HTML';

        text = formatElementToHTML(children);
    }

    const params = React.useMemo(() => {
        return {
            parse_mode: parseMode,
            disable_web_page_preview: disableWebPagePreview,
            disable_notification: disableNotification,
            reply_to_message_id: replyToMessageId,
            reply_markup: {
                force_reply: forceReply,
            },
        };
    }, [parseMode, disableWebPagePreview, disableNotification, replyToMessageId, forceReply]);

    return (
        <text
            text={text}
            chatId={chat.id}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            params={params}
        />
    );
}
