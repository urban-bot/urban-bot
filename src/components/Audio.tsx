import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';

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

    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

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
