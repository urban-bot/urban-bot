import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import { getDefaultParseMode } from '../specific';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';

export type LocationProps = UrbanMessageCommonData & {
    latitude: number;
    longitude: number;
    livePeriod?: number;
    title?: React.ReactNode;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};

export function Location({
    latitude,
    longitude,
    livePeriod,
    title,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: LocationProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
        bot,
    } = useBotContext();

    let finalParseMode = parseMode ?? parseModeContext;
    if (React.isValidElement(title) || Array.isArray(title)) {
        finalParseMode = finalParseMode ?? getDefaultParseMode(bot.type);
    }
    const formattedTitle = formatMarkupLanguageElement(title, finalParseMode);

    const formattedButtons = getButtonsByButtonGroup(buttonGroupElement);

    return (
        <urban-location
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                latitude,
                longitude,
                livePeriod,
                title: formattedTitle,
                buttons: formattedButtons,
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                parseMode: finalParseMode,
                disableNotification,
                replyToMessageId,
                forceReply,
                ...otherProps,
            }}
        />
    );
}
