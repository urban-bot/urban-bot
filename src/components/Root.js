import React from 'react';
import TelegramBot from 'node-telegram-bot-api';
import { AbstractBot } from '../AbstractBot';
import { BotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';

function Chat({ bot, user, children, isNewMessageEveryRender, chat }) {
    return (
        <BotContext.Provider key={chat.id} value={{ bot, user, isNewMessageEveryRender, chat }}>
            <ErrorBoundary>{children}</ErrorBoundary>
        </BotContext.Provider>
    );
}

export function Root({
    children,
    token,
    timeToClearUserSession = 1000 * 60 * 10,
    options = {},
    isNewMessageEveryRender = false,
}) {
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef({});

    const [firstMessage, setFirstMessage] = React.useState();

    const telegramBot = React.useMemo(() => new TelegramBot(token, options), [token, options]);
    const bot = React.useMemo(() => new AbstractBot(telegramBot), [telegramBot]);

    // TODO update session not only for new message. For example it could be inlineQuery or edit message
    React.useEffect(() => {
        function handler(message) {
            const { from, chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat
                        bot={bot}
                        user={from}
                        key={chatId}
                        isNewMessageEveryRender={isNewMessageEveryRender}
                        chat={chat}
                    >
                        {children}
                    </Chat>,
                );
                bot.addPromiseQueue(chatId);
                setChats(new Map(chatsRef.current));
                setFirstMessage(message);
            }

            clearTimeout(timeoutIdsRef.current[chatId]);
            timeoutIdsRef.current[chatId] = setTimeout(() => {
                chatsRef.current.delete(chatId);
                bot.deletePromiseQueue(chatId);
                setChats(new Map(chatsRef.current));
            }, timeToClearUserSession);
        }

        bot.on('message', handler);

        return () => {
            bot.removeListener('message', handler);
        };
    }, [bot, timeToClearUserSession, children, isNewMessageEveryRender]);

    React.useEffect(() => {
        if (firstMessage !== undefined) {
            // First message is needed to register user and initialize react children for him.
            // After initializing we repeat this message that react children can process it.
            bot.emit('message', firstMessage);
        }
    }, [firstMessage, bot]);

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
