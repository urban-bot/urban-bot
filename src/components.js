import React from 'react';
import { bot } from './render';
import { BotContext, RouterContext } from './context';
import { useInput, useBotContext } from './hooks';
//
// function Pass({userId, children}) {
//     React.useEffect(() => {
//         console.log(userId, 'Pass start');
//
//         return () => {
//             console.log(userId,'Pass leave');
//         };
//     }, []);
//     return children;
//     return <BotContext.Provider value={{ userId }}>{children}</BotContext.Provider>;
// }

export function Root({ children }) {
    const [userIds, setUserIds] = React.useState(new Set());

    // TODO remove userId after leave or timeout
    useInput(
        ({ from: { id } }) => {
            if (!userIds.has(id)) {
                setUserIds(new Set([...userIds, id]));
            }
        },
        [userIds, setUserIds],
    );

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
                    <BotContext.Provider key={userId} value={{ userId }}>
                        {children}
                    </BotContext.Provider>
                );
            })}
        </>
    );
}

export function Router({ children }) {
    const [activePath, setActivePath] = React.useState();
    const { userId } = useBotContext();

    useInput(
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
            console.log(userId,'Router leave');
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

// TODO remove listeners after leave
export function ButtonGroup({ children, title }) {
    const [messageData, setMessageData] = React.useState();
    const { userId } = React.useContext(BotContext);

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
        };

        bot.on('callback_query', onCallbackQuery);

        const value = { text: title, ...params };

        bot.sendMessage(userId, value.text, value);

        return () => {
            bot.removeListener('callback_query', onCallbackQuery);
        }
    }, [children, title, userId]);



    // if (messageData === undefined) {
    //     bot.sendMessage(userId, value.text, value).then((res) => {
    //         // FIXME make excess second render
    //         setMessageData(res);
    //     });
    // } else {
    //     const opts = {
    //         chat_id: messageData.chat.id,
    //         message_id: messageData.message_id,
    //     };
    //     bot.editMessageText(value.text, { ...params, ...opts });
    // }

    return null;
}

export function Text({ children }) {
    const { userId } = React.useContext(BotContext);

    if (userId) {
        bot.sendMessage(userId, children);

        return null;
    } else {
        return null;
    }
}

export function Image({ src, caption, inlineButtons }) {
    const { userId } = React.useContext(BotContext);
    const params = {};

    if (caption) {
        params.caption = caption;
    }

    // FIXME doesn't work
    if (inlineButtons) {
        const { reply_markup } = inlineButtons.type(inlineButtons.props);
        params.reply_markup = reply_markup;
    }

    if (userId) {
        bot.sendPhoto(userId, src, params);

        return null;
    } else {
        return null;
    }
}

// TODO add later?
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log('ErrorBoundary', error);
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // Можно отрендерить запасной UI произвольного вида
            return null;
        }

        return this.props.children;
    }
}
