import React from 'react';
import { useBotContext } from '../hooks';

export function Text({ children, isNewMessageEveryRender: isNewMessageEveryRenderProp }) {
    const { userId, bot, isNewMessageEveryRender: isNewMessageEveryRenderContext } = useBotContext();

    return (
        <text
            text={children}
            userId={userId}
            bot={bot}
            isNewMessageEveryRender={
                isNewMessageEveryRenderProp !== undefined ? isNewMessageEveryRenderProp : isNewMessageEveryRenderContext
            }
        />
    );
}
