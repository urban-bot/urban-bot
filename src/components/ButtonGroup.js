import React from 'react';
import { useBotContext, useAction } from '../hooks';
import { formatButtonElement } from '../utils/formatButtonElement';

export function ButtonGroup(props) {
    const { children, title, isNewMessageEveryRender: isNewMessageEveryRenderProp, ...otherProps } = props;
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const buttons = formatButtonElement(children);

    useAction((ctx) => {
        const { actionId } = ctx;

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            if (actionId === button.id) {
                button.onClick(ctx);

                break;
            }
        }
    });

    return (
        <buttons
            chatId={chat.id}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            title={title}
            buttons={buttons}
            {...otherProps}
        />
    );
}

export function Button() {
    return null;
}
