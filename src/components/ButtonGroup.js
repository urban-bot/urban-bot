import React from 'react';
import { useBotContext } from '../hooks';

export function ButtonGroup({ children, title, isNewMessageEveryRender: isNewMessageEveryRenderProp }) {
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();
    const callbackRef = React.useRef();

    const params = {
        reply_markup: {
            inline_keyboard: [[]],
        },
    };

    const arrChildren = Array.isArray(children) ? children : [children];

    const ids = arrChildren.map((child) => {
        const id = String(Math.random());
        // FIXME inline_keyboard can be matrix
        params.reply_markup.inline_keyboard[0].push({ text: child.props.children, callback_data: id });

        return id;
    });

    if (callbackRef.current) {
        bot.removeListener('callback_query', callbackRef.current);
    }

    callbackRef.current = function onCallbackQuery(callbackQuery) {
        ids.forEach((id, i) => {
            const callbackQueryId = callbackQuery.data;

            if (callbackQueryId === id) {
                arrChildren[i].props.onClick(callbackQuery);
            }
        });
    };

    bot.on('callback_query', callbackRef.current);

    React.useEffect(() => {
        return () => {
            bot.removeListener('callback_query', callbackRef.current);
        };
    }, [bot]);

    return (
        <text
            chatId={chat.id}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            text={title}
            {...params}
        />
    );
}

export function Button() {
    return null;
}
