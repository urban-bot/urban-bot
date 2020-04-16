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
        disableNotification,
        replyToMessageId,
        forceReply,
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

        const button = buttons.find(({ id }) => {
            return actionId === id;
        });

        button?.onClick(ctx);
    });

    return (
        <buttons
            chat={chat}
            bot={bot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            title={title}
            buttons={buttons}
            parseMode={parseMode}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}

export function Button() {
    return null;
}
