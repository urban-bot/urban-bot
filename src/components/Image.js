import React from 'react';
import { useBotContext } from '../hooks';

export function Image({ src, caption, buttons, isNewMessageEveryRender: isNewMessageEveryRenderProp }) {
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const params = {};

    if (typeof caption === 'string') {
        params.caption = caption;
    }

    if (typeof buttons?.type === 'function') {
        const { props } = buttons.type(buttons.props);

        const { reply_markup } = props.params || {};

        params.reply_markup = reply_markup;
    }

    return (
        <img
            src={src}
            bot={bot}
            chatId={chat.id}
            params={params}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
        />
    );
}
