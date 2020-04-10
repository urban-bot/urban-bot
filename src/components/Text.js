import React from 'react';
import { useBotContext } from '../hooks';
import { formatElementToString } from '../utils/formatElementToString';

export function Text({
    children,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    forceReply,
    selective,
}) {
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let text;
    if (typeof children === 'string' || typeof children === 'number') {
        text = children;
    } else {
        parseMode = 'HTML';

        text = formatElementToString(children);
    }

    const params = React.useMemo(() => {
        const params = {
            parse_mode: parseMode,
            disable_web_page_preview: disableWebPagePreview,
            disable_notification: disableNotification,
            reply_to_message_id: replyToMessageId,
        };

        if (forceReply !== undefined || selective !== undefined) {
            const reply_markup = {
                force_reply: forceReply,
                selective: selective,
            };

            params.reply_markup = reply_markup;
        }

        return params;
    }, [parseMode, disableWebPagePreview, disableNotification, replyToMessageId, forceReply, selective]);

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
