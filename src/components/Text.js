import React from 'react';
import { useBotContext } from '../hooks';

export function Text({ children }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        if (messageData === undefined) {
            bot.sendMessage(userId, children).then((res) => {
                setMessageData(res);
            });
        } else {
            const options = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };
            bot.editMessageText(children, options);
        }
    }, [children, userId]);

    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}
