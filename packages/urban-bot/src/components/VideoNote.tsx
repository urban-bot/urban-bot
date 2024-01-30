import { useBotContext } from '../hooks/useBotContext';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import type { FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData, UrbanFileFormat } from '../types';
import type { ButtonGroupProps } from './Button/types';

export type VideoNoteProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    duration?: number;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};

export function VideoNote({
    file,
    buttons: buttonGroupElement,
    disableNotification,
    duration,
    forceReply,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    replyToMessageId,
    ...otherProps
}: VideoNoteProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const formattedButtons = getButtonsByButtonGroup(buttonGroupElement);

    return (
        <urban-video-note
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                buttons: formattedButtons,
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                file,
                duration,
                ...otherProps,
            }}
        />
    );
}
