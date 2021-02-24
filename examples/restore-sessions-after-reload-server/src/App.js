import React, { useEffect, useState } from 'react';
import { Notification, Text, useBotContext } from '@urban-bot/core';
import { getChats, saveChat } from './local-storage';

export function App() {
    const [activeChatIds, setActiveChatIds] = useState([]);
    const { chat } = useBotContext();

    useEffect(() => {
        saveChat(chat);

        const activeChatIds = getChats()
            .map(({ id }) => id)
            .join(', ');

        setActiveChatIds(activeChatIds);
    }, [chat]);

    if (activeChatIds.length === 0) {
        return null;
    }

    // if you reload app (restart nodejs process), notification will continue to be sent to the previous users
    // because all sessions are stored in a local storage
    return (
        <Notification intervalSeconds={3}>
            <Text>Active chats: {activeChatIds}</Text>
        </Notification>
    );
}
