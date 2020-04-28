import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormatElement } from '../hooks/useFormatElement';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';
import { UrbanElementButtons } from '../global.d';

export type AudioProps = UrbanMessageCommonData & {
    file: string | Buffer | NodeJS.ReadableStream;
    name?: string;
    title?: React.ReactNode;
    isNewMessageEveryRender?: boolean;
    duration?: number;
    author?: string;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
};

export function Audio({
    audio,
    name,
    author,
    buttons: buttonGroupElement,
    disableNotification,
    duration,
    forceReply,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    replyToMessageId,
    title,
    ...otherProps
}: AudioProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    // TODO remove duplicated code with Image
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

    const [formattedTitle, finalParseMode] = useFormatElement(title, parseMode);

    return (
        <urban-audio
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
                audio,
                name,
                duration,
                author,
                ...otherProps,
            }}
        />
    );
}