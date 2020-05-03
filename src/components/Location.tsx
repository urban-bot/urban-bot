import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';

export type LocationProps = UrbanMessageCommonData & {
    latitude: number;
    longitude: number;
    activeSeconds?: number;
    title?: React.ReactNode;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};

export function Location({
    latitude,
    longitude,
    activeSeconds,
    title,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: LocationProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-location
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                latitude,
                longitude,
                activeSeconds,
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
