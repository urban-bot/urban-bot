import { useBotContext } from '../hooks';
import { getButtonsByButtonGroup, formatMarkupLanguageElement, getParseMode } from '../utils';
import type { ReactNode, FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData, UrbanFileFormat } from '../types';
import type { ButtonGroupProps } from './Button';

export type AudioProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    name?: string;
    title?: ReactNode;
    isNewMessageEveryRender?: boolean;
    duration?: number;
    author?: string;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
};

export function Audio({
    file,
    name,
    author,
    title,
    duration,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: AudioProps) {
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
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                title: formattedTitle,
                file,
                name,
                duration,
                author,
                ...otherProps,
            }}
        />
    );
}
