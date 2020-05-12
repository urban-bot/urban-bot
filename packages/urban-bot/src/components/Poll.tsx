import React from 'react';
import { useAction, useBotContext } from '../hooks/hooks';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import { OtherProps } from '../types/common';
import { formatOptionElement } from '../utils/formatOptionElement';
import { formatMarkupLanguageElement } from '../utils/formatMarkupLanguageElement';

export type PollProps = UrbanMessageCommonData & {
    question: string;
    children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
    isAnonymous?: boolean;
    type?: string;
    withMultipleAnswers?: boolean;
    rightOption?: string | number;
    explanation?: React.ReactChild;
    livePeriod?: number;
    closeTime?: number;
};

export function Poll({
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    question,
    children,
    isAnonymous,
    type,
    withMultipleAnswers,
    rightOption,
    explanation,
    livePeriod,
    closeTime,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: PollProps) {
    const {
        $$managerBot,
        isNewMessageEveryRender: isNewMessageEveryRenderContext,
        chat,
        parseMode: parseModeContext,
        bot,
    } = useBotContext();

    let finalParseMode = parseMode ?? parseModeContext;
    if (React.isValidElement(question) || React.isValidElement(explanation)) {
        finalParseMode = finalParseMode ?? bot.defaultParseMode;
    }
    const formattedQuestion = formatMarkupLanguageElement(question, finalParseMode);
    const formattedExplanation = formatMarkupLanguageElement(explanation, finalParseMode);

    const formattedButtons = getButtonsByButtonGroup(buttonGroupElement);
    const options = formatOptionElement(children);

    useAction((ctx) => {
        const { actionId } = ctx;

        const option = options.find(({ id }) => {
            return actionId === id;
        });

        option?.onClick?.(ctx);
    });

    return (
        <urban-poll
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                question: formattedQuestion,
                options,
                isAnonymous,
                type,
                withMultipleAnswers,
                rightOption,
                explanation: formattedExplanation,
                livePeriod,
                closeTime,
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons: formattedButtons,
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                ...otherProps,
            }}
        />
    );
}

export type OptionProps = OtherProps & {
    children: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
    id?: string;
};

export function Option(_props: OptionProps) {
    return null;
}
