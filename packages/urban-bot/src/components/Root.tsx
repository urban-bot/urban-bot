import React from 'react';
import { getBotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
import { ManagerBot } from '../ManagerBot/ManagerBot';
import { UrbanBotType, UrbanChat, UrbanParseMode } from '../types';
import { UrbanBot } from '../types/UrbanBot';
import { UrbanSyntheticEvent } from '../types/Events';
import { getExpressApp, listen } from '../expressApp';

export type ChatProps<BotType extends UrbanBotType> = {
    bot: UrbanBot<BotType>;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode?: UrbanParseMode;
    $$managerBot: ManagerBot<BotType>;
    children: React.ReactNode;
    key: string;
};

function Chat<BotType extends UrbanBotType>({
    bot,
    children,
    isNewMessageEveryRender,
    chat,
    parseMode,
    $$managerBot,
}: ChatProps<BotType>) {
    const BotContext = getBotContext<BotType>();

    return (
        <BotContext.Provider
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore key exists
            key={chat.id}
            value={{ bot, isNewMessageEveryRender, chat, parseMode, $$managerBot }}
        >
            <ErrorBoundary>{children}</ErrorBoundary>
        </BotContext.Provider>
    );
}

export type RootProps<BotType extends UrbanBotType> = {
    bot: UrbanBot<BotType>;
    children: React.ReactNode;
    sessionTimeSeconds?: number;
    isNewMessageEveryRender?: boolean;
    parseMode?: UrbanParseMode;
    port?: number;
};

export function Root<BotType extends UrbanBotType>({
    children,
    bot,
    sessionTimeSeconds = 60 * 60 * 24 * 7,
    isNewMessageEveryRender = true,
    parseMode,
    port = 8080,
}: RootProps<BotType>) {
    // TODO get chats from $$managerBot?
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef<{ [key: string]: NodeJS.Timer }>({});

    const [firstMessage, setFirstMessage] = React.useState<UrbanSyntheticEvent<BotType>>();

    React.useEffect(() => {
        if (bot.initializeServer !== undefined) {
            const { app } = getExpressApp(port);
            bot.initializeServer(app);
            listen(port);
        }
    }, [port, bot]);
    const $$managerBot = React.useMemo(() => new ManagerBot(bot), [bot]);

    React.useEffect(() => {
        function handler(message: UrbanSyntheticEvent<BotType>) {
            const { chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat
                        bot={bot}
                        $$managerBot={$$managerBot}
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
            }, sessionTimeSeconds * 1000);
        }

        $$managerBot.on('any', handler);

        return () => {
            $$managerBot.removeListener('any', handler);
        };
    }, [$$managerBot, sessionTimeSeconds, children, isNewMessageEveryRender, bot, parseMode]);

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
