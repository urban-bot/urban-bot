import { UrbanChat, UrbanParseMode } from './index';

export type UrbanButton = {
    text: string;
    id?: string;
};

export type UrbanMessageCommon = {
    chat: UrbanChat;
};

export type UrbanMessageCommonData = {
    parseMode?: UrbanParseMode;
    disableNotification?: boolean;
    replyToMessageId?: string;
    forceReply?: boolean;
};

export type UrbanMessageTextData = UrbanMessageCommonData & {
    text: string;
    disableWebPagePreview?: boolean;
};

export type UrbanNewMessageText = UrbanMessageCommon & {
    nodeName: 'text';
    data: UrbanMessageTextData;
};

export type UrbanMessageImageData = UrbanMessageCommonData & {
    title?: string;
    src: string;
    buttons?: UrbanButton[];
    // FIXME rename to alt
    altText?: string;
};

export type UrbanNewMessageImage = UrbanMessageCommon & {
    nodeName: 'img';
    data: UrbanMessageImageData;
};

export type UrbanMessageButtonsData = UrbanMessageCommonData & {
    title: string;
    buttons: UrbanButton[];
};

export type UrbanNewMessageButtons = UrbanMessageCommon & {
    nodeName: 'buttons';
    data: UrbanMessageButtonsData;
};

export type UrbanNewMessage = UrbanNewMessageText | UrbanNewMessageImage | UrbanNewMessageButtons;
export type UrbanNewMessageData = UrbanMessageTextData | UrbanMessageImageData | UrbanMessageButtonsData;

export type UrbanExistingMessage<Meta> = UrbanNewMessage & {
    meta: Meta;
};

export type UrbanNewMessageType = UrbanNewMessage['nodeName'];
