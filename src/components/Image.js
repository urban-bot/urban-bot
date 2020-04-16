import React from 'react';
import { useBotContext } from '../hooks';
import { formatHTMLElement } from '../utils/formatHTMLElement';

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
        ...otherProps
    } = props;
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let formattedButtons;
    if (buttonsElement !== undefined) {
        const { props } = buttonsElement.type(buttonsElement.props);
        const { buttons } = props ?? {};

        formattedButtons = buttons;
    }

    let parseMode = parseModeProp;
    let title = titleElement;
    if (typeof titleElement !== 'string' && typeof titleElement !== 'number') {
        parseMode = 'HTML';
        title = formatHTMLElement(titleElement);
    }

    return (
        <img
            bot={bot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            src={src}
            title={title}
            buttons={formattedButtons}
            parseMode={parseMode}
            disableNotification={disableNotification}
            replyToMessageId={replyToMessageId}
            forceReply={forceReply}
            {...otherProps}
        />
    );
}
