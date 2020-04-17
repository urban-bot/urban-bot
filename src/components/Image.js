import React from 'react';
import { useBotContext } from '../hooks';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';

export function Image(props) {
    const {
        src,
        title: titleElement,
        buttons: buttonsElement,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        parseMode: parseModeProp,
        disableNotification,
        replyToMessageId,
        forceReply,
        altText,
        ...otherProps
    } = props;
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
    } = useBotContext();

    let formattedButtons;
    if (buttonsElement !== undefined) {
        const { props } = buttonsElement.type(buttonsElement.props);
        const { buttons } = props ?? {};

        formattedButtons = buttons;
    }

    let parseMode = parseModeProp ?? parseModeContext;
    let title = titleElement;

    if (typeof children !== 'string' && typeof children !== 'number') {
        parseMode = parseMode ?? 'HTML';
        title = formatMarkupLanguageElement(titleElement, parseMode);
    }

    return (
        <img
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            src={src}
            title={title}
            altText={altText}
            buttons={formattedButtons}
            parseMode={parseMode}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}
