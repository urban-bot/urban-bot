import React from 'react';
import { useBotContext } from '../hooks';

export function Image(props) {
    const {
        src,
        title,
        buttons: buttonsElement,
        isNewMessageEveryRender: isNewMessageEveryRenderProp,
        ...otherProps
    } = props;
    const { bot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let formattedButtons;
    if (buttonsElement !== undefined) {
        const { props } = buttonsElement.type(buttonsElement.props);
        const { buttons } = props ?? {};

        formattedButtons = buttons;
    }

    return (
        <img
            bot={bot}
            chatId={chat.id}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            src={src}
            title={title}
            buttons={formattedButtons}
            {...otherProps}
        />
    );
}
