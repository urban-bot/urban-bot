import { UrbanButton } from '@urban-bot/core';
import { flatten } from 'array-flatten';

export function formatReplyButtons(buttons: UrbanButton[] | UrbanButton[][]) {
    return flatten(buttons).map((button) => {
        return {
            content_type: button.type ?? 'text',
            title: button.text,
            payload: button.id,
            image_url: button.image_url,
        };
    });
}

export function formatButtons(buttons: UrbanButton[] | UrbanButton[][]) {
    return flatten(buttons).map((button) => {
        if (button.url !== undefined) {
            return {
                type: 'web_url',
                title: button.text,
                url: button.url,
                messenger_extensions: true,
            };
        }

        return { type: 'postback', title: button.text, payload: button.id };
    });
}

export type GenericTemplateProps = {
    title?: string;
    subtitle?: string;
    image_url?: string;
    buttons?: UrbanButton[] | UrbanButton[][];
};

export function formatGenericTemplate({ title, subtitle, buttons, image_url }: GenericTemplateProps) {
    return {
        type: 'template',
        payload: {
            template_type: 'generic',
            elements: [
                {
                    title,
                    subtitle,
                    image_url,
                    buttons: buttons ? formatButtons(buttons) : undefined,
                },
            ],
        },
    };
}
