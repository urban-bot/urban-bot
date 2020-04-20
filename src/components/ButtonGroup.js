import React from 'react';
import { useBotContext, useAction } from '../dist/hooks/hooks';
import { formatButtonElement } from '../utils/formatButtonElement';
import { useFormatElement } from '../hooks/useFormatElement';

export function ButtonGroup(props) {
    const {
        children,
        title,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode,
        disableNotification,
        replyToMessageId,
        forceReply,
        ...otherProps
    } = props;
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const buttons = formatButtonElement(children);
    const [formattedTitle, finalParseMode] = useFormatElement(title, parseMode);

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
            title={formattedTitle}
            buttons={buttons}
            parseMode={finalParseMode}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}

export function Button(_props) {
    return null;
}
