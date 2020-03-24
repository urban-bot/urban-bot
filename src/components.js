import React from 'react';
import { bot } from './render';
import { BotContext } from './context';
import { useInput } from './hooks';

export function Router({ children }) {
    const [userIds, setUserIds] = React.useState(new Set());
    const [activePath, setActivePath] = React.useState();

    useInput(({ text, from: { id } }) => {
        if (!userIds.has(id)) {
            setUserIds(new Set([...userIds, id]));
        }

        if (text[0] === '/') {
            setActivePath(text);
        }
    }, [userIds, setUserIds]);

    const child = (Array.isArray(children) ? children : [children]).find((child) => {
        return child.props.path === activePath;
    });

    // FIXME divide routes and userId context
    return (
        <>
            {Array.from(userIds).map((userId) => {
                return <BotContext.Provider key={userId} value={{ userId, activePath, setActivePath }}>{child}</BotContext.Provider>
            })}
        </>
    );
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

    bot.on('callback_query', function onCallbackQuery(callbackQuery) {
        ids.forEach((id, i) => {
            const callbackQueryId = callbackQuery.data;

            if (callbackQueryId === id) {
                arrChildren[i].props.onClick(callbackQuery);
            }
        });
    });

    const value = { text: title, ...params };

    if (userId) {
        if (messageData === undefined) {
            bot.sendMessage(userId, value.text, value).then((res) => {
                // FIXME make excess second render
                setMessageData(res);
            });
        } else {
            const opts = {
                chat_id: messageData.chat.id,
                message_id: messageData.message_id,
            };
            bot.editMessageText(value.text, { ...params, ...opts });
        }

        return null;
    } else {
        return null;
    }
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
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.error(error);
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
