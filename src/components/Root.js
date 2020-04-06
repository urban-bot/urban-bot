import React from 'react';
import TelegramBot from 'node-telegram-bot-api';
import { AbstractBot } from '../AbstractBot';
import { BotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
let i = 0;
function randomString() {
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    );
}

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
            const { id, first_name, last_name, username, language_code } = from;

            const user = { firstName: first_name, lastName: last_name, username, languageCode: language_code };

            if (!usersRef.current.has(id)) {
                usersRef.current.set(id, user);
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

    React.useEffect(() => {
        setInterval(() => {
            const id = Math.random();
            bot.emit('message', {
                // text: i++ % 2 === 0 ? '/start' : '/help',
                text: '/start',
                chat: {
                    id,
                },
                from: {
                    id,
                    first_name: randomString(),
                    last_name: randomString(),
                    username: randomString(),
                    language_code: randomString(),
                },
            });
        }, 3000);
    }, [bot]);

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
