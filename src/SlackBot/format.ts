import { SlackMessageContext, SlackPayload, SLACK } from './types';
import { UrbanEvent } from '../types/Events';
import { UrbanButton } from '../types/Messages';
import { Button, SectionBlock } from '@slack/types';

export function formatMessage(message: SlackMessageContext): UrbanEvent<SLACK, SlackPayload> {
    return {
        type: 'text',
        chat: {
            id: message.channel,
        },
        from: {
            id: message.user,
        },
        payload: {
            text: message.text,
        },
        nativeEvent: {
            type: 'SLACK',
            payload: message,
        },
    };
}

export function formatButtons(buttons: UrbanButton[]): Button[] {
    return buttons.map((button) => {
        return {
            type: 'button',
            text: {
                type: 'plain_text',
                text: button.text,
                emoji: true,
            },
            value: button.id,
        };
    });
}

export function formatTitle(title: string): SectionBlock {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: title,
        },
    };
}
