import React from 'react';
import { useBotContext } from '../hooks';

export const Text = React.memo(function Text({ children }) {
    const { userId, bot } = useBotContext();

    return <message text={children} userId={userId} bot={bot} />;
});
