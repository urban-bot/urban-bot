import { UrbanChat, UrbanParseMode } from './index';
import { OtherProps } from '../types';

export type UrbanButton = OtherProps & {
    text: string;
    id?: string;
};

export type UrbanMessageCommon = {
    chat: UrbanChat;
};

export type UrbanMessageCommonData = OtherProps & {
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
    title: string;
    src: string;
    buttons: UrbanButton[];
    // FIXME rename to alt
    altText: string;
};

export type UrbanNewMessageImage = UrbanMessageCommon & {
    nodeName: 'img';
    buttons: UrbanButton[];
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

export type UrbanExistingMessage<Meta> = UrbanNewMessage & {
    meta: Meta;
};

export type UrbanNewMessageType = UrbanNewMessage['nodeName'];
