import { useBotContext } from '../hooks';
import type { UrbanMessageMediaData } from '../types';

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

    // TODO add format files title
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
