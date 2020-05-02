import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';
import { UrbanFileFormat } from '../types';

export type AnimationProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    name?: string;
    title?: React.ReactNode;
    duration?: number;
    author?: string;
    width?: number;
    height?: number;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};
export function Animation({
    file,
    name,
    author,
    height,
    width,
    buttons: buttonGroupElement,
    disableNotification,
    duration,
    forceReply,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    replyToMessageId,
    title,
    ...otherProps
}: AnimationProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-animation
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
                file,
                name,
                duration,
                author,
                height,
                width,
                ...otherProps,
            }}
        />
    );
}
