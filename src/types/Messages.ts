import { UrbanChat, UrbanParseMode } from './index';
import { OtherProps } from './common';

export type UrbanButton = {
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

export type UrbanMessageText = UrbanMessageCommon & {
    nodeName: 'urban-text';
    data: UrbanMessageTextData;
};

export type UrbanMessageImageData = UrbanMessageCommonData & {
    title?: string;
    image: string | Buffer | NodeJS.ReadableStream;
    buttons?: UrbanButton[];
    alt?: string;
};

export type UrbanMessageImage = UrbanMessageCommon & {
    nodeName: 'urban-img';
    data: UrbanMessageImageData;
};

export type UrbanMessageButtonsData = UrbanMessageCommonData & {
    title: string;
    buttons: UrbanButton[];
};

export type UrbanMessageButtons = UrbanMessageCommon & {
    nodeName: 'urban-buttons';
    data: UrbanMessageButtonsData;
};

export type UrbanMessage = UrbanMessageText | UrbanMessageImage | UrbanMessageButtons;
export type UrbanMessageData = UrbanMessageTextData | UrbanMessageImageData | UrbanMessageButtonsData;

export type UrbanExistingMessage<MessageMeta> = UrbanMessage & {
    meta: MessageMeta;
};

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
