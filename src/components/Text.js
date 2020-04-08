import React from 'react';
import { useBotContext } from '../hooks';
import { formatElementToHTML } from '../utils/formatElementToHTML';

export function Text({ children, isNewMessageEveryRender: isNewMessageEveryRenderProp, parseMode }) {
    const { userId, bot, isNewMessageEveryRender: isNewMessageEveryRenderContext } = useBotContext();

    if (typeof children !== 'string') {
        parseMode = 'HTML';
    }

    const text = formatElementToHTML(children);

    return (
        <text
            text={text}
            userId={userId}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            params={{
                parse_mode: parseMode,
            }}
        />
    );
}
