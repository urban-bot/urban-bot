import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { formatText } from '../utils/formatText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';
import { UrbanFileFormat } from '../types';

export type ImageProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    name?: string;
    title?: React.ReactNode;
    alt?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
};

export function Image({
    file,
    title,
    alt,
    name,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    ...otherProps
}: ImageProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
    } = useBotContext();

    const finalParseMode = parseMode ?? parseModeContext;
    const formattedTitle = formatText(title, finalParseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-img
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                parseMode: finalParseMode,
                buttons: formattedButtons,
                title: formattedTitle,
                alt,
                file,
                name,
                ...otherProps,
            }}
        />
    );
}
