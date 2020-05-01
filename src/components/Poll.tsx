import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { useFormattedText } from '../hooks/useFormattedText';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';

export type PollProps = UrbanMessageCommonData & {
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
    question: string;
    options: string[];
    isAnonymous?: boolean;
    type?: string;
    withMultipleAnswers?: boolean;
    rightOption?: string | number;
    explanation?: React.ReactChild;
    activeSeconds?: number;
    closeTime?: number;
};

export function Poll({
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    question,
    options,
    isAnonymous,
    type,
    withMultipleAnswers,
    rightOption,
    explanation,
    activeSeconds,
    closeTime,
    disableNotification,
    forceReply,
    parseMode,
    replyToMessageId,
    ...otherProps
}: PollProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const [formattedQuestion, finalParseMode] = useFormattedText(question, parseMode);
    const [formattedExplanation] = useFormattedText(explanation, parseMode);
    const formattedButtons = useFormattedButtons(buttonGroupElement);

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
                activeSeconds,
                closeTime,
                disableNotification,
                replyToMessageId,
                forceReply,
                parseMode: finalParseMode,
                buttons: formattedButtons,
                ...otherProps,
            }}
        />
    );
}
