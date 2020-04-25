import React from 'react';
import { getBotContext } from '../context';
import { ErrorBoundary } from './ErrorBoundary';
import { ManagerBot } from '../ManagerBot/ManagerBot';
import { UrbanChat, UrbanFrom, UrbanParseMode } from '../types';
import { UrbanBot } from '../types/UrbanBot';
import { UrbanNativeEvent, UrbanSyntheticEvent } from '../types/Events';
import { MARKDOWN_MODE } from '../utils/formatMarkupLanguageElement';

export type ChatProps<NativeEvent extends UrbanNativeEvent, MessageMeta> = {
    bot: UrbanBot<NativeEvent, MessageMeta>;
    from?: UrbanFrom;
    chat: UrbanChat;
    isNewMessageEveryRender: boolean;
    parseMode: UrbanParseMode;
    $$managerBot: ManagerBot<NativeEvent, MessageMeta>;
    children: React.ReactNode;
    key: string;
};

function Chat<NativeEvent extends UrbanNativeEvent, MessageMeta>({
    bot,
    from,
    children,
    isNewMessageEveryRender,
    chat,
    parseMode,
    $$managerBot,
}: ChatProps<NativeEvent, MessageMeta>) {
    const BotContext = getBotContext<NativeEvent, MessageMeta>();

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

export type RootProps<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown> = {
    bot: UrbanBot<NativeEvent, MessageMeta>;
    children: React.ReactNode;
    timeToClearUserSession?: number;
    isNewMessageEveryRender?: boolean;
    parseMode?: UrbanParseMode;
};

export function Root<NativeEvent extends UrbanNativeEvent = UrbanNativeEvent, MessageMeta = unknown>({
    children,
    bot,
    timeToClearUserSession = 1000 * 60 * 10,
    isNewMessageEveryRender = false,
    parseMode = MARKDOWN_MODE,
}: RootProps<NativeEvent, MessageMeta>) {
    // TODO get chats from $$managerBot?
    const [chats, setChats] = React.useState(new Map());
    const chatsRef = React.useRef(chats);
    chatsRef.current = chats;

    const timeoutIdsRef = React.useRef<{ [key: string]: NodeJS.Timer }>({});

    const [firstMessage, setFirstMessage] = React.useState<UrbanSyntheticEvent<NativeEvent>>();

    const $$managerBot = React.useMemo(() => new ManagerBot(bot), [bot]);

    React.useEffect(() => {
        function handler(message: UrbanSyntheticEvent<NativeEvent>) {
            const { from, chat } = message;
            const { id: chatId } = chat;

            if (!chatsRef.current.has(chatId)) {
                chatsRef.current.set(
                    chat.id,
                    <Chat<NativeEvent, MessageMeta>
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
