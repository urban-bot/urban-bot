import React from 'react';
import { getBotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
import { ManagerBot } from '../ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from '../types';
import { UrbanBot } from '../types/UrbanBot';
import { UrbanEvent } from '../types/Events';
import { MARKDOWN_MODE } from '../utils/formatMarkupLanguageElement';

export type ChatProps<Type, NativeEventPayload, Meta> = {
    bot: UrbanBot<Type, NativeEventPayload, Meta>;
    from?: UrbanFrom;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    $$managerBot: ManagerBot<Type, NativeEventPayload, Meta>;
    children: React.ReactNode;
    key: string;
};

function Chat<Type, NativeEventPayload, Meta>({
    bot,
    from,
    children,
    isNewMessageEveryRender,
    chat,
    parseMode,
    $$managerBot,
}: ChatProps<Type, NativeEventPayload, Meta>) {
    const BotContext = getBotContext<Type, NativeEventPayload, Meta>();

    return (
        <BotContext.Provider
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore key exists
            key={chat.id}
            value={{ bot, from, isNewMessageEveryRender, chat, parseMode, $$managerBot }}
        >
            <ErrorBoundary>{children}</ErrorBoundary>
        </BotContext.Provider>
    );
}

export type RootProps<Type = unknown, NativeEventPayload = unknown, Meta = unknown> = {
    bot: UrbanBot<Type, NativeEventPayload, Meta>;
    children: React.ReactNode;
    timeToClearUserSession?: number;
    isNewMessageEveryRender?: boolean;
    parseMode?: UrbanParseMode;
};

export function Root<Type = unknown, NativeEventPayload = unknown, Meta = unknown>({
    children,
    bot,
    timeToClearUserSession = 1000 * 60 * 10,
    isNewMessageEveryRender = false,
    parseMode = MARKDOWN_MODE,
}: RootProps<Type, NativeEventPayload, Meta>) {
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef<{ [key: string]: NodeJS.Timer }>({});

    const [firstMessage, setFirstMessage] = React.useState<UrbanEvent<Type, NativeEventPayload>>();

    const $$managerBot = React.useMemo(() => new ManagerBot(bot), [bot]);

    React.useEffect(() => {
        function handler(message: UrbanEvent<Type, NativeEventPayload>) {
            const { from, chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat<Type, NativeEventPayload, Meta>
                        bot={bot}
                        $$managerBot={$$managerBot}
                        from={from}
                        key={chatId}
                        isNewMessageEveryRender={isNewMessageEveryRender}
                        chat={chat}
                        parseMode={parseMode}
                    >
                        {children}
                    </Chat>,
                );
                $$managerBot.addChat(chatId);
                setChats(new Map(chatsRef.current));
                setFirstMessage(message);
            }

            clearTimeout(timeoutIdsRef.current[chatId]);
            timeoutIdsRef.current[chatId] = setTimeout(() => {
                chatsRef.current.delete(chatId);
                $$managerBot.deleteChat(chatId);
                setChats(new Map(chatsRef.current));
            }, timeToClearUserSession);
        }

        return () => {
            $$managerBot.removeListener('any', handler);
        };
    }, [$$managerBot, timeToClearUserSession, children, isNewMessageEveryRender, bot, parseMode]);

    React.useEffect(() => {
        if (firstMessage !== undefined) {
            // First message is needed to register chat and initialize react children for it.
            // After initializing we repeat this message that react children can process it.
            $$managerBot.emit('any', firstMessage);
            $$managerBot.emit(firstMessage.type, firstMessage);
        }
    }, [firstMessage, $$managerBot]);

    return (
        <>
            {Array.from(chats).map(([, children]) => {
                return children;
            })}
        </>
    );
}
