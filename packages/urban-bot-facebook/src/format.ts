import { UrbanButton } from '@urban-bot/core';
import { flatten } from 'array-flatten';

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
