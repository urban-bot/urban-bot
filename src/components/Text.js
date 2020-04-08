import React from 'react';
import { useBotContext } from '../hooks';
import { formatElementToHTML } from '../utils/formatElementToHTML';

export function Text({ children, isNewMessageEveryRender: isNewMessageEveryRenderProp }) {
    const { userId, bot, isNewMessageEveryRender: isNewMessageEveryRenderContext } = useBotContext();

    const text = formatElementToHTML(children);

    return (
        <text
            text={text}
            userId={userId}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            params={{
                parse_mode: 'HTML',
            }}
        />
    );
}
