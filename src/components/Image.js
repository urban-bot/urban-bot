import React from 'react';
import { useBotContext } from '../dist/hooks/hooks';
import { useFormatElement } from '../hooks/useFormatElement';

export function Image(props) {
    const {
        src,
        title,
        buttons: buttonsElement,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode,
        disableNotification,
        replyToMessageId,
        forceReply,
        altText,
        ...otherProps
    } = props;
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let formattedButtons;
    if (buttonsElement !== undefined) {
        const { props } = buttonsElement.type(buttonsElement.props);
        const { buttons } = props ?? {};

        formattedButtons = buttons;
    }

    const [formattedTitle, finalParseMode] = useFormatElement(title, parseMode);

    return (
        <img
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            src={src}
            title={formattedTitle}
            altText={altText}
            buttons={formattedButtons}
            parseMode={finalParseMode}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}
