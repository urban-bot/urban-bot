import React from 'react';
import { useBotContext } from '../hooks';

export function Image({ src, caption, inlineButtons }) {
    const { userId, bot } = useBotContext();

    const params = {};

    if (caption) {
        params.caption = caption;
    }

    // FIXME doesn't work
    if (inlineButtons) {
        const { reply_markup } = inlineButtons.type(inlineButtons.props);
        params.reply_markup = reply_markup;
    }

    return <img src={src} bot={bot} userId={userId} params={params} />;
}
