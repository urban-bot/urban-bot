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
    file: string | Buffer | NodeJS.ReadableStream;
    name?: string;
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

export type UrbanMessageAudioData = UrbanMessageCommonData & {
    title?: string;
    file: string | Buffer | NodeJS.ReadableStream;
    name?: string;
    buttons?: UrbanButton[];
    duration?: number;
    author?: string;
};

export type UrbanMessageAudio = UrbanMessageCommon & {
    nodeName: 'urban-audio';
    data: UrbanMessageAudioData;
};

export type UrbanMessage = UrbanMessageText | UrbanMessageImage | UrbanMessageButtons | UrbanMessageAudio;
export type UrbanMessageData =
    | UrbanMessageTextData
    | UrbanMessageImageData
    | UrbanMessageButtonsData
    | UrbanMessageAudioData;

type Meta<MessageMeta> = {
    meta: MessageMeta;
};

export type UrbanExistingMessage<MessageMeta> = UrbanMessage & Meta<MessageMeta>;

export type UrbanExistingMessageByType<T extends UrbanMessageNodeName, MessageMeta> = T extends 'urban-text'
    ? UrbanMessageText & Meta<MessageMeta>
    : T extends 'urban-buttons'
    ? UrbanMessageButtons & Meta<MessageMeta>
    : T extends 'urban-img'
    ? UrbanMessageImage & Meta<MessageMeta>
    : T extends 'urban-audio'
    ? UrbanMessageAudio & Meta<MessageMeta>
    : UrbanExistingMessage<MessageMeta>;

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
