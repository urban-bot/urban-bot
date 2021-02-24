import { LocalStorage } from 'node-localstorage';

export const localStorage = LocalStorage('./storage');

export const CHAT_MAP_KEY = 'CHAT_MAP_KEY';

export function getChatsMap() {
    const chatsRaw = localStorage.getItem(CHAT_MAP_KEY);
    return JSON.parse(chatsRaw) ?? {};
}

export function getChats() {
    const chatsMap = getChatsMap();

    return Object.values(chatsMap);
}

export function saveChat(chat) {
    const chatsMap = getChatsMap();

    const newChatsMap = {
        ...chatsMap,
        [chat.id]: chat,
    };

    localStorage.setItem(CHAT_MAP_KEY, JSON.stringify(newChatsMap));
}
