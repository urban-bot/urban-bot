import { useBotContext } from '../hooks/useBotContext';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';
import { getParseMode } from '../utils/getParseMode';
import type { ReactNode, FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData, UrbanFileFormat } from '../types';
import type { ButtonGroupProps } from './Button/types';

export type FileProps = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    title?: ReactNode;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
    name?: string;
};

export function File({
    file,
    title,
    name,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: FileProps) {
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
        <urban-file
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                file,
                name,
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
