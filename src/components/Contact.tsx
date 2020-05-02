import React from 'react';
import { useBotContext } from '../hooks/hooks';
import { UrbanMessageCommonData } from '../types/Messages';
import { ButtonGroupProps } from './ButtonGroup';
import { useFormattedButtons } from '../hooks/useFormattedButtons';

export type ContactProps = UrbanMessageCommonData & {
    phoneNumber?: string | number;
    username?: string;
    firstName?: string;
    lastName?: string;
    vCard?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
};

export function Contact({
    phoneNumber,
    username,
    firstName,
    lastName,
    vCard,
    buttons: buttonGroupElement,
    isNewMessageEveryRender: isNewMessageEveryRenderProp,
    disableNotification,
    forceReply,
    replyToMessageId,
    ...otherProps
}: ContactProps) {
    const { $$managerBot, isNewMessageEveryRender: isNewMessageEveryRenderContext, chat } = useBotContext();

    const formattedButtons = useFormattedButtons(buttonGroupElement);

    return (
        <urban-contact
            $$managerBot={$$managerBot}
            chat={chat}
            isNewMessageEveryRender={isNewMessageEveryRenderProp ?? isNewMessageEveryRenderContext}
            data={{
                phoneNumber,
                username,
                firstName,
                lastName,
                vCard,
                buttons: formattedButtons,
                disableNotification,
                replyToMessageId,
                forceReply,
                ...otherProps,
            }}
        />
    );
}
