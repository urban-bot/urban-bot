import { UrbanChat, useBotContext } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { getApiHooksCreator } from '../api/helpers';

export function getUserProfilePhoto(urbanBotTelegram: UrbanBotTelegram, chat: UrbanChat) {
    return urbanBotTelegram.bot
        .getUserProfilePhotos(chat.id)
        .then((userProfilePhotos) => userProfilePhotos.photos[userProfilePhotos.total_count - 1])
        .then((photos) => photos[photos.length - 1]);
}

export const useGetUserProfilePhoto = getApiHooksCreator(getUserProfilePhoto);

export function useUserProfilePhoto() {
    const { bot, chat } = useBotContext<UrbanBotTelegram>();
    return useGetUserProfilePhoto(bot, chat);
}
