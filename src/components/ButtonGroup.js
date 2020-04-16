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
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
    } = useBotContext();

    const buttons = formatButtonElement(children);

    let parseMode = parseModeProp ?? parseModeContext;
    let title = titleElement;

    if (typeof children !== 'string' && typeof children !== 'number') {
        parseMode = parseMode ?? 'HTML';
        title = formatHTMLElement(titleElement, parseMode);
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
            $$managerBot={$$managerBot}
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
