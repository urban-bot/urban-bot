import { useBotContext } from '../hooks/useBotContext';
import type { UrbanMessageMediaData } from '../types';

export type MediaProps = UrbanMessageMediaData & {
    isNewMessageEveryRender?: boolean;
};

export function Media({
    title,
    files,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: MediaProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    // TODO add format files title
    return (
        <urban-media
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                title,
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
