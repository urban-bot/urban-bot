import { useAction, useBotContext } from '../hooks';
import { getButtonsByButtonGroup, formatMarkupLanguageElement, getParseMode, formatOptionElement } from '../utils';
import type { ReactElement, FunctionComponentElement, ReactChild } from 'react';
import type { UrbanMessageCommonData, OtherProps } from '../types';
import type { ButtonGroupProps } from './Button';

export type PollProps = UrbanMessageCommonData & {
    question: string;
    children: ReactElement<OptionProps> | ReactElement<OptionProps>[];
    buttons?: FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
    isAnonymous?: boolean;
    type?: string;
    withMultipleAnswers?: boolean;
    rightOption?: string | number;
    explanation?: ReactChild;
    livePeriodSeconds?: number;
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
    livePeriodSeconds,
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

    const finalParseModeQuestion = getParseMode(question, parseMode, parseModeContext, bot.defaultParseMode);
    const finalParseModeExplanation = getParseMode(explanation, parseMode, parseModeContext, bot.defaultParseMode);
    const finalParseMode = finalParseModeQuestion ?? finalParseModeExplanation;
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
                livePeriodSeconds,
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
    id?: string;
    children: string;
    // FIXME describe type for onClick?
    onClick?: (...args: unknown[]) => unknown;
};

export function Option(_props: OptionProps) {
    return null;
}
