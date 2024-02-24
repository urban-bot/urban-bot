import React from 'react';
import { Media } from '@urban-bot/core';

export function MediaExample() {
    return (
        <Media
            title="Media group with beautiful images"
            isNewMessageEveryRender={false}
            files={[
                {
                    type: 'image',
                    file: 'AgACAgUAAxkBAAIcqGXVsd_LxvXuPU7lYpBBwNJ4KG0WAAKmujEb_a2wVl3qpSIEoU0rAQADAgADeQADNAQ',
                },
                {
                    type: 'image',
                    file: 'AgACAgUAAxkBAAIcqWXVsd8YtMP8sc4Snbgea_0XMuabAAKlujEb_a2wVieYsx-YgR2GAQADAgADeQADNAQ',
                },
                {
                    type: 'image',
                    file: 'AgACAgUAAxkBAAIcqmXVsd_0B9Wo1ZmYrrCE7awJIy9VAAKkujEb_a2wVjfPdkExK1kJAQADAgADeQADNAQ',
                },
            ]}
        />
    );
}
