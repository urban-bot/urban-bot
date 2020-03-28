import React from 'react';
import { BotContext, RouterContext } from './context';
import { useMessage, useBotContext } from './hooks';
import TelegramBot from 'node-telegram-bot-api';
import { AbstractBot } from './AbstractBot';

export function Root({ children, token, timeToClearUserSession = 1000 * 60 * 10 }) {
    const [userIds, setUserIds] = React.useState(new Set());
    const timeoutIdsRef = React.useRef({});
    const userIdsIdRef = React.useRef(userIds);
    const [firstMessage, setFirstMessage] = React.useState();
    userIdsIdRef.current = userIds;
    const options = {
        polling: true,
    };
    const telegramBotRef = React.useRef(new TelegramBot(token, options));
    const abstractBotRef = React.useRef(new AbstractBot(telegramBotRef.current));

    // TODO update session not only for new message. For example it could be inlineQuery or edit message
    useMessage((message) => {
        const { from: { id } } = message;
        if (!userIdsIdRef.current.has(id)) {
            setUserIds(new Set([...userIdsIdRef.current, id]));
            setFirstMessage(message);
        }

        clearTimeout(timeoutIdsRef.current[id]);
        timeoutIdsRef.current[id] = setTimeout(() => {
            userIdsIdRef.current.delete(id);
            setUserIds(new Set(userIdsIdRef.current));
        }, timeToClearUserSession);
    }, [], abstractBotRef.current);

    React.useEffect(() => {
        if (firstMessage !== undefined) {
            abstractBotRef.current.emit('message', firstMessage);
        }
    }, [firstMessage]);

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
                    // FIXME first message doesn't process by application, have to do send two message to start
                    <BotContext.Provider key={userId} value={{ userId, bot: abstractBotRef.current }}>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </BotContext.Provider>
                );
            })}
        </>
    );
}

export function Router({ children }) {
    const [activePath, setActivePath] = React.useState();
    const { userId, bot } = useBotContext();

    useMessage(
        ({ text }) => {
            if (text[0] === '/') {
                setActivePath(text);
            }
        },
        [setActivePath],
    );

    React.useEffect(() => {
        console.log(userId, 'Router start');

        return () => {
            console.log(userId, 'Router leave');
        };
    }, []);

    const child = (Array.isArray(children) ? children : [children]).find((child) => {
        return child.props.path === activePath;
    });

    return <RouterContext.Provider value={{ activePath, setActivePath }}>{child}</RouterContext.Provider>;
}

export function Route({ path, children }) {
    return <>{children}</>;
}

export function Button() {
    return null;
}

export function ButtonGroup({ children, title }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        const params = {
            reply_markup: {
                inline_keyboard: [[]],
            },
        };

        const arrChildren = Array.isArray(children) ? children : [children];

        const ids = arrChildren.map((child, i) => {
            const id = String(Math.random());
            // FIXME inline_keyboard can be matrix
            params.reply_markup.inline_keyboard[0].push({ text: child.props.children, callback_data: id });

            return id;
        });

        function onCallbackQuery(callbackQuery) {
            ids.forEach((id, i) => {
                const callbackQueryId = callbackQuery.data;

                if (callbackQueryId === id) {
                    arrChildren[i].props.onClick(callbackQuery);
                }
            });
        }

        bot.on('callback_query', onCallbackQuery);

        const value = { text: title, ...params };

        if (messageData === undefined) {
            bot.sendMessage(userId, value.text, value).then((res) => {
                setMessageData(res);
            });
        } else {
            const options = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };
            bot.editMessageText(value.text, { ...params, ...options });
        }

        return () => {
            bot.removeListener('callback_query', onCallbackQuery);
        };
    }, [children, title, userId, messageData]);

    // TODO add MODE with deletion or not
    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}

export function Text({ children }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        if (messageData === undefined) {
            bot.sendMessage(userId, children).then((res) => {
                setMessageData(res);
            });
        } else {
            const options = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };
            bot.editMessageText(children, options);
        }
    }, [children, userId]);

    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}

export function Image({ src, caption, inlineButtons }) {
    const [messageData, setMessageData] = React.useState();
    const { userId, bot } = useBotContext();

    React.useEffect(() => {
        const params = {};

        if (caption) {
            params.caption = caption;
        }

        // FIXME doesn't work
        if (inlineButtons) {
            const { reply_markup } = inlineButtons.type(inlineButtons.props);
            params.reply_markup = reply_markup;
        }

        if (messageData === undefined) {
            bot.sendPhoto(userId, src, params).then((res) => {
                setMessageData(res);
            });
        } else {
            const opts = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };

            const media = {
                type: 'photo',
                caption,
                media: src,
            };
            bot.editMessageMedia(media, { ...params, ...opts });
        }
    }, [userId, inlineButtons, src, caption]);

    React.useEffect(() => {
        return () => {
            if (messageData) {
                bot.deleteMessage(messageData.chat.id, messageData.message_id);
            }
        };
    }, [messageData]);

    return null;
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.error(error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
