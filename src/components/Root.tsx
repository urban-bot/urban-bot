import React from 'react';
import { getBotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
import { ManagerBot } from '../ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from '../types';
import { UrbanBot, UrbanBotInstance } from '../types/UrbanBotInstance';
import { UrbanSyntheticEvent } from '../types/Events';
import { MARKDOWN_MODE } from '../utils/formatMarkupLanguageElement';

export type ChatProps<Bot extends UrbanBot> = {
    bot: UrbanBotInstance<Bot>;
    from?: UrbanFrom;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    $$managerBot: ManagerBot<Bot>;
    children: React.ReactNode;
    key: string;
};

function Chat<Bot extends UrbanBot>({
    bot,
    from,
    children,
    isNewMessageEveryRender,
    chat,
    parseMode,
    $$managerBot,
}: ChatProps<Bot>) {
    const BotContext = getBotContext<Bot>();

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

export type RootProps<Bot extends UrbanBot> = {
    bot: UrbanBotInstance<Bot>;
    children: React.ReactNode;
    timeToClearUserSession?: number;
    isNewMessageEveryRender?: boolean;
    parseMode?: UrbanParseMode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Root<Bot extends UrbanBot<any, any>>({
    children,
    bot,
    timeToClearUserSession = 1000 * 60 * 10,
    isNewMessageEveryRender = false,
    parseMode = MARKDOWN_MODE,
}: RootProps<Bot>) {
    // TODO get chats from $$managerBot?
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef<{ [key: string]: NodeJS.Timer }>({});

    const [firstMessage, setFirstMessage] = React.useState<UrbanSyntheticEvent<Bot['NativeEvent']>>();

    const $$managerBot = React.useMemo(() => new ManagerBot(bot), [bot]);

    React.useEffect(() => {
        function handler(message: UrbanSyntheticEvent<Bot['NativeEvent']>) {
            const { from, chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat<Bot>
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

        $$managerBot.on('any', handler);

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
