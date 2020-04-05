import React from 'react';
import TelegramBot from 'node-telegram-bot-api';
import { AbstractBot } from '../AbstractBot';
import { BotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';

export function Root({ children, token, timeToClearUserSession = 1000 * 60 * 10, options = {} }) {
    const [userIds, setUserIds] = React.useState(new Set());
    const userIdsIdRef = React.useRef(userIds);
    userIdsIdRef.current = userIds;

    const timeoutIdsRef = React.useRef({});

    const [firstMessage, setFirstMessage] = React.useState();

    const telegramBot = React.useMemo(() => new TelegramBot(token, options), [token, options]);
    const bot = React.useMemo(() => new AbstractBot(telegramBot), [telegramBot]);

    // TODO update session not only for new message. For example it could be inlineQuery or edit message
    React.useEffect(() => {
        function handler(message) {
            const {
                from: { id },
            } = message;
            if (!userIdsIdRef.current.has(id)) {
                setUserIds(new Set([...userIdsIdRef.current, id]));
                bot.addPromiseQueue(id);
                setFirstMessage(message);
            }

            clearTimeout(timeoutIdsRef.current[id]);
            timeoutIdsRef.current[id] = setTimeout(() => {
                userIdsIdRef.current.delete(id);
                bot.deletePromiseQueue(id);
                setUserIds(new Set(userIdsIdRef.current));
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
            {Array.from(userIds).map((userId) => {
                return (
                    // FIXME pass all user data
                    <BotContext.Provider key={userId} value={{ userId, bot }}>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </BotContext.Provider>
                );
            })}
        </>
    );
}
