import { Chat, UrbanParseMode } from './index';
import { OtherProps } from '../types';

export type UrbanBotButton = OtherProps & {
    text: string;
    id?: string;
};

export type UrbanBotMessageCommon = {
    chat: Chat;
};

export type UrbanBotMessageCommonData = OtherProps & {
    parseMode?: UrbanParseMode;
    disableNotification?: boolean;
    replyToMessageId?: string;
    forceReply?: boolean;
};

export type UrbanBotMessageTextData = UrbanBotMessageCommonData & {
    text: string;
    disableWebPagePreview?: boolean;
};

export type UrbanBotNewMessageText = UrbanBotMessageCommon & {
    nodeName: 'text';
    data: UrbanBotMessageTextData;
};

export type UrbanBotMessageImageData = UrbanBotMessageCommonData & {
    title: string;
    src: string;
    buttons: UrbanBotButton[];
    // FIXME rename to alt
    altText: string;
};

export type UrbanBotNewMessageImage = UrbanBotMessageCommon & {
    nodeName: 'img';
    buttons: UrbanBotButton[];
    data: UrbanBotMessageImageData;
};

export type UrbanBotMessageButtonsData = UrbanBotMessageCommonData & {
    title: string;
    buttons: UrbanBotButton[];
};

export type UrbanBotNewMessageButtons = UrbanBotMessageCommon & {
    nodeName: 'buttons';
    data: UrbanBotMessageButtonsData;
};

export type UrbanBotNewMessage = UrbanBotNewMessageText | UrbanBotNewMessageImage | UrbanBotNewMessageButtons;

export type UrbanBotExistingMessage<Meta> = UrbanBotNewMessage & {
    meta: Meta;
};

export type UrbanBotNewMessageType = UrbanBotNewMessage['nodeName'];
