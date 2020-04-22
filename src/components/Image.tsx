import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormatElement } from '../hooks/useFormatElement';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';
import { UrbanElementButtons } from '../global.d';

export type ImageProps = UrbanMessageCommonData & {
    src: string;
    title?: React.ReactNode;
    // FIXME rename to alt
    altText?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
};

export function Image({
    src,
    title,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    altText,
    ...otherProps
}: ImageProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    let formattedButtons;
    if (buttonGroupElement !== undefined) {
        if (!React.Children.only(buttonGroupElement) && buttonGroupElement.type !== ButtonGroup) {
            throw new Error('Pass only one ButtonGroup component to buttons');
        }

        const buttonsElementChildren = buttonGroupElement.type(buttonGroupElement.props);

        if (buttonsElementChildren === null) {
            throw new Error('ButtonGroup component should return children');
        }

        const { buttons } = buttonsElementChildren.props as UrbanElementButtons;

        formattedButtons = buttons;
    }

    const [formattedTitle, finalParseMode] = useFormatElement(title, parseMode);

    return (
        <urban-img
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
