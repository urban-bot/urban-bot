import { useBotContext } from '../hooks/useBotContext';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';
import type { ReactNode, FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData, UrbanFileFormat } from '../types';
import type { ButtonGroupProps } from './Button/types';

export type VoiceProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    title?: ReactNode;
    duration?: number;
    isNewMessageEveryRender?: boolean;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
};

export function Voice({
    file,
    title,
    duration,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: VoiceProps) {
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
        <urban-voice
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons: formattedButtons,
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                title: formattedTitle,
                file,
                duration,
                ...otherProps,
            }}
        />
    );
}
