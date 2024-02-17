import dotenv from 'dotenv';
import React from 'react';
import { Text } from '@urban-bot/core';

dotenv.config();

export function CommandsMessage() {
    return (
        <Text isNewMessageEveryRender>
            /text
            <br />
            /image
            <br />
            /buttons
            <br />
            /reply_buttons
            <br />
            /matrix_buttons
            <br />
            /matrix_buttons_max_columns
            <br />
            /hooks
            <br />
            /tree_dialog
            <br />
            /flat_dialog
            <br />
            /checkbox_dialog
            <br />
            /queue
            <br />
            /audio
            <br />
            /video
            <br />
            /file
            <br />
            /poll
            <br />
            /contact
            <br />
            /animation
            <br />
            /media
            <br />
            /location
            <br />
            /router
            <br />
            /notification
        </Text>
    );
}
