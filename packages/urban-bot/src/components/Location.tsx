import { useBotContext } from '../hooks/useBotContext';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';
import type { ReactNode, FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData } from '../types';
import type { ButtonGroupProps } from './Button/types';

export type LocationProps = UrbanMessageCommonData & {
    latitude: number;
    longitude: number;
    livePeriodSeconds?: number;
    title?: ReactNode;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};

export function Location({
    latitude,
    longitude,
    livePeriodSeconds,
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

    const finalParseMode = getParseMode(title, parseMode, parseModeContext, bot.defaultParseMode);
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
                livePeriodSeconds,
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
