import { useBotContext } from '../hooks';
import { formatMarkupLanguageElement, getParseMode } from '../utils';
import type { ReactNode } from 'react';
import type { UrbanMessageCommonData } from '../types';

export type TextProps = UrbanMessageCommonData & {
    children: ReactNode;
    disableWebPagePreview?: boolean;
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

    const finalParseMode = getParseMode(children, parseMode, parseModeContext, bot.defaultParseMode);
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
