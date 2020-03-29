import React from 'react';
import { useBotContext } from '../hooks';

export function Image({ src, caption, inlineButtons }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        const params = {};

        if (caption) {
            params.caption = caption;
        }

        // FIXME doesn't work
        if (inlineButtons) {
            const { reply_markup } = inlineButtons.type(inlineButtons.props);
            params.reply_markup = reply_markup;
        }

        if (messageData === undefined) {
            bot.sendPhoto(userId, src, params).then((res) => {
                setMessageData(res);
            });
        } else {
            const opts = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };

            const media = {
                type: 'photo',
                caption,
                media: src,
            };
            bot.editMessageMedia(media, { ...params, ...opts });
        }
    }, [userId, inlineButtons, src, caption]);

    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}
