import React from 'react';
import { useBotContext } from '../hooks/hooks';
// import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageMediaData } from '../types/Messages';

export type MediaProps = UrbanMessageMediaData & {
    isNewMessageEveryRender?: boolean;
};

export function Media({
    files,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: MediaProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    // const [formattedTitle, finalParseMode] = useFormattedText(title, parseMode);
    // const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-media
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                files,
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode,
                ...otherProps,
            }}
        />
    );
}
