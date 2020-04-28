import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';
import { UrbanElementButtons } from '../global.d';

export type ImageProps = UrbanMessageCommonData & {
    file: string | Buffer | NodeJS.ReadableStream;
    name?: string;
    title?: React.ReactNode;
    alt?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
};

export function Image({
    image,
    title,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    name,
    alt,
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

        const { data } = buttonsElementChildren.props as UrbanElementButtons;

        formattedButtons = data.buttons;
    }

    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);

    return (
        <urban-img
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons: formattedButtons,
                title: formattedTitle,
                alt,
                image,
                name,
                ...otherProps,
            }}
        />
    );
}
