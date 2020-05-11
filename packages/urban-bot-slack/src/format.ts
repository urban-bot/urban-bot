import { UrbanButton } from 'urban-bot';
import { Button, SectionBlock } from '@slack/types';

export function formatButtons(buttons: UrbanButton[] | UrbanButton[][]): Button[] {
    if (Array.isArray(buttons[0])) {
        throw new Error('Please provide flat buttons structure to urban-bot-slack');
    }

    return (buttons as UrbanButton[]).map((button) => {
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

export function withRightSpaceIfExist(text: string | undefined) {
    return text ? `${text} ` : '';
}
