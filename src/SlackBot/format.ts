import { UrbanButton } from '../types/Messages';
import { Button, SectionBlock } from '@slack/types';

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
