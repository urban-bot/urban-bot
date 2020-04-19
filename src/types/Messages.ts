import { Chat, ParseMode } from './index';

export type UrbanBotMessageCommon = {
    chat: Chat;
};

export type UrbanBotNewMessageText = {
    nodeName: 'text';
    data: {
        text: string;
        parseMode: ParseMode;
        disableWebPagePreview: boolean;
        disableNotification: boolean;
        replyToMessageId: string;
        forceReply: boolean;
    };
} & UrbanBotMessageCommon;

export type UrbanBotNewMessageImage = {
    nodeName: 'img';
    data: {
        title: string;
        src: string;
        // FIXME describe buttons
        buttons: any;
        // FIXME rename to alt
        altText: string;
        parseMode: ParseMode;
        disableNotification: boolean;
        replyToMessageId: string;
        forceReply: boolean;
    };
} & UrbanBotMessageCommon;

export type UrbanBotNewMessageButtons = {
    nodeName: 'buttons';
    data: {
        title: string;
        // FIXME describe buttons
        buttons: any;
        parseMode: ParseMode;
        disableNotification: boolean;
        replyToMessageId: string;
        forceReply: boolean;
    };
} & UrbanBotMessageCommon;

export type UrbanBotNewMessage = UrbanBotNewMessageText | UrbanBotNewMessageImage | UrbanBotNewMessageButtons;

export type UrbanBotExistingMessage<Meta> = {
    meta: Meta;
} & UrbanBotNewMessage;

export type UrbanBotNewMessageType = UrbanBotNewMessage['nodeName'];
