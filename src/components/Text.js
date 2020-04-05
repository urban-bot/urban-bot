import React from 'react';
import { useBotContext } from '../hooks';

export function Text({ children }) {
    const { userId, bot } = useBotContext();

    return <message text={children} userId={userId} bot={bot} />;
}
