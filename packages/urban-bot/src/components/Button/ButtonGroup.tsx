import { flatten } from 'array-flatten';
import { useBotContext, useAction } from '../../hooks';
import {
    formatMarkupLanguageElement,
    formatButtonElement,
    getParseMode,
    groupFlatArray,
    isArrayMatrix,
} from '../../utils';
import type { ButtonGroupProps } from './types';

export function ButtonGroup({
    children,
    title,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    parseMode,
    disableNotification,
    replyToMessageId,
    forceReply,
    maxColumns,
    isReplyButtons = false,
    ...otherProps
}: ButtonGroupProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
        bot,
    } = useBotContext();
    let buttons = formatButtonElement(children);

    if (typeof maxColumns === 'number') {
        if (!isArrayMatrix(buttons)) {
            buttons = groupFlatArray(buttons, maxColumns);
        } else {
            console.error('When you use "maxColumns" the buttons children must be flatten array');
        }
    }

    const finalParseMode = getParseMode(title, parseMode, parseModeContext, bot.defaultParseMode);
    const formattedTitle = formatMarkupLanguageElement(title, finalParseMode);

    useAction((ctx) => {
        const { actionId } = ctx;

        const button = flatten(buttons).find(({ id }) => {
            return actionId === id;
        });

        button?.onClick?.(ctx);
    });

    return (
        <urban-buttons
            chat={chat}
            $$managerBot={$$managerBot}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons,
                title: formattedTitle,
                isReplyButtons,
                ...otherProps,
            }}
        />
    );
}
