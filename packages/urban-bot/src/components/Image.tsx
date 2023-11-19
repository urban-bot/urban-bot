import { useBotContext } from '../hooks';
import { getButtonsByButtonGroup, formatMarkupLanguageElement, getParseMode } from '../utils';
import type { ReactNode, FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData, UrbanFileFormat } from '../types';
import type { ButtonGroupProps } from './Button';

export type ImageProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    name?: string;
    title?: ReactNode;
    alt?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
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
        bot,
    } = useBotContext();

    const finalParseMode = getParseMode(title, parseMode, parseModeContext, bot.defaultParseMode);
    const formattedTitle = formatMarkupLanguageElement(title, finalParseMode);

    const formattedButtons = getButtonsByButtonGroup(buttonGroupElement);

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
