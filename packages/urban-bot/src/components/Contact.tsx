import { useBotContext } from '../hooks/useBotContext';
import { getButtonsByButtonGroup } from '../utils/getButtonsByButtonGroup';
import type { FunctionComponentElement } from 'react';
import type { UrbanMessageCommonData } from '../types';
import type { ButtonGroupProps } from './Button/types';

export type ContactProps = UrbanMessageCommonData & {
    phoneNumber?: string | number;
    username?: string;
    firstName?: string;
    lastName?: string;
    vCard?: string;
    isNewMessageEveryRender?: boolean;
    buttons?: FunctionComponentElement<ButtonGroupProps>;
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

    const formattedButtons = getButtonsByButtonGroup(buttonGroupElement);

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
                isReplyButtons: buttonGroupElement?.props.isReplyButtons,
                disableNotification,
                replyToMessageId,
                forceReply,
                ...otherProps,
            }}
        />
    );
}
