import React from 'react';
import { useBotContext } from '../hooks';

export function Image({ src, caption, buttons, isNewMessageEveryRender: isNewMessageEveryRenderProp }) {
    const { userId, bot, isNewMessageEveryRender: isNewMessageEveryRenderContext } = useBotContext();

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
            userId={userId}
            params={params}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
        />
    );
}
