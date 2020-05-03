import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';
import { UrbanFileFormat } from '../types';

export type FileProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    title?: React.ReactNode;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
    name?: string;
};

export function File({
    file,
    title,
    name,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: FileProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-file
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                file,
                name,
                title: formattedTitle,
                buttons: formattedButtons,
                parseMode: finalParseMode,
                disableNotification,
                replyToMessageId,
                forceReply,
                ...otherProps,
            }}
        />
    );
}
