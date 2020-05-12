import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { UrbanMessageCommonData } from '../types/Messages';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';

export type TextProps = UrbanMessageCommonData & {
    disableWebPagePreview?: boolean;
    children: React.ReactNode;
    isNewMessageEveryRender?: boolean;
};

export function Text({
    children,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    forceReply,
    ...otherProps
}: TextProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
        bot,
    } = useBotContext();

    let finalParseMode = parseMode ?? parseModeContext;
    if (React.isValidElement(children) || Array.isArray(children)) {
        finalParseMode = finalParseMode ?? bot.defaultParseMode;
    }
    const formattedText = formatMarkupLanguageElement(children, finalParseMode);

    return (
        <urban-text
            chat={chat}
            $$managerBot={$$managerBot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                disableWebPagePreview,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                text: formattedText,
                ...otherProps,
            }}
        />
    );
}
