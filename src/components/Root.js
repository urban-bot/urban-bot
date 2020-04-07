import React from 'react';
import TelegramBot from 'node-telegram-bot-api';
import { AbstractBot } from '../AbstractBot';
import { BotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';

export function Root({ children, token, timeToClearUserSession = 1000 * 60 * 10, options = {} }) {
    const [users, setUsers] = React.useState(new Map());
    const usersRef = React.useRef(users);
    usersRef.current = users;

    const timeoutIdsRef = React.useRef({});

    const [firstMessage, setFirstMessage] = React.useState();

    const telegramBot = React.useMemo(() => new TelegramBot(token, options), [token, options]);
    const bot = React.useMemo(() => new AbstractBot(telegramBot), [telegramBot]);

    // TODO update session not only for new message. For example it could be inlineQuery or edit message
    React.useEffect(() => {
        function handler(message) {
            const { from } = message;
            const { id } = from;

            if (!usersRef.current.has(id)) {
                usersRef.current.set(id, from);
                bot.addPromiseQueue(id);
                setUsers(new Map(usersRef.current));
                setFirstMessage(message);
            }

            clearTimeout(timeoutIdsRef.current[id]);
            timeoutIdsRef.current[id] = setTimeout(() => {
                usersRef.current.delete(id);
                bot.deletePromiseQueue(id);
                setUsers(new Map(usersRef.current));
            }, timeToClearUserSession);
        }

        bot.on('message', handler);

        return () => {
            bot.removeListener('message', handler);
        };
    }, [bot, timeToClearUserSession]);

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
            {Array.from(users).map(([userId, user]) => {
                return (
                    <BotContext.Provider key={userId} value={{ userId, bot, ...user }}>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </BotContext.Provider>
                );
            })}
        </>
    );
}
