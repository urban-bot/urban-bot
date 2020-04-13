import React from 'react';
import { useBotContext, useAction } from '../hooks';
import { formatButtonElement } from '../utils/formatButtonElement';
import { formatHTMLElement } from '../utils/formatHTMLElement';

export function ButtonGroup(props) {
    const {
        children,
        title: titleElement,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode: parseModeProp,
        ...otherProps
    } = props;
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const buttons = formatButtonElement(children);

    let parseMode = parseModeProp;
    let title = titleElement;
    if (typeof titleElement !== 'string' && typeof titleElement !== 'number') {
        parseMode = 'HTML';
        title = formatHTMLElement(titleElement);
    }

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
            parseMode={parseMode}
            {...otherProps}
        />
    );
}

export function Button() {
    return null;
}
