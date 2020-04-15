import React from 'react';
import { BotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
import { ManagerBot } from '../ManagerBot/ManagerBot';
import { getRandomId } from '../utils/getRandomId';

function Chat({ bot, user, children, isNewMessageEveryRender, chat }) {
    return (
        <BotContext.Provider key={chat.id} value={{ bot, user, isNewMessageEveryRender, chat }}>
            <ErrorBoundary>{children}</ErrorBoundary>
        </BotContext.Provider>
    );
}

export function Root({ children, bot, timeToClearUserSession = 1000 * 60 * 10, isNewMessageEveryRender = false }) {
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef({});

    const [firstMessage, setFirstMessage] = React.useState();

    const managerBot = React.useMemo(() => new ManagerBot(bot), [bot]);

    // TODO update session not only for new message. For example it could be inlineQuery or edit message
    React.useEffect(() => {
        const eventId = getRandomId();

        function handler(message) {
            const { from, chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat
                        bot={managerBot}
                        user={from}
                        key={chatId}
                        isNewMessageEveryRender={isNewMessageEveryRender}
                        chat={chat}
                    >
                        {children}
                    </Chat>,
                );
                managerBot.addChat(chatId);
                setChats(new Map(chatsRef.current));
                setFirstMessage(message);
            }

            clearTimeout(timeoutIdsRef.current[chatId]);
            timeoutIdsRef.current[chatId] = setTimeout(() => {
                chatsRef.current.delete(chatId);
                managerBot.deleteChat(chatId);
                setChats(new Map(chatsRef.current));
            }, timeToClearUserSession);
        }

        managerBot.on('message', handler, eventId);

        return () => {
            managerBot.removeListener('message', handler, eventId);
        };
    }, [managerBot, timeToClearUserSession, children, isNewMessageEveryRender]);

    React.useEffect(() => {
        if (firstMessage !== undefined) {
            // First message is needed to register user and initialize react children for him.
            // After initializing we repeat this message that react children can process it.
            managerBot.emit('message', firstMessage);
        }
    }, [firstMessage, managerBot]);

    React.useEffect(() => {
        console.log('Root start');

        return () => {
            console.log('Root leave');
        };
    }, []);

    return (
        <>
            {Array.from(chats).map(([, children]) => {
                return children;
            })}
        </>
    );
}
