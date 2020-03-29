import React from 'react';
import { useBotContext } from '../hooks';

export function ButtonGroup({ children, title }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        const params = {
            reply_markup: {
                inline_keyboard: [[]],
            },
        };

        const arrChildren = Array.isArray(children) ? children : [children];

        const ids = arrChildren.map((child, i) => {
            const id = String(Math.random());
            // FIXME inline_keyboard can be matrix
            params.reply_markup.inline_keyboard[0].push({ text: child.props.children, callback_data: id });

            return id;
        });

        function onCallbackQuery(callbackQuery) {
            ids.forEach((id, i) => {
                const callbackQueryId = callbackQuery.data;

                if (callbackQueryId === id) {
                    arrChildren[i].props.onClick(callbackQuery);
                }
            });
        }

        bot.on('callback_query', onCallbackQuery);

        const value = { text: title, ...params };

        if (messageData === undefined) {
            bot.sendMessage(userId, value.text, value).then((res) => {
                setMessageData(res);
            });
        } else {
            const options = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };
            bot.editMessageText(value.text, { ...params, ...options });
        }

        return () => {
            bot.removeListener('callback_query', onCallbackQuery);
        };
    }, [children, title, userId, messageData]);

    // TODO add MODE with deletion or not
    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}

export function Button() {
    return null;
}
