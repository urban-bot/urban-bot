import { UrbanChat, UrbanFileFormat, UrbanParseMode } from './index';
import { OtherProps } from './common';

export type UrbanButton = {
    text: string;
    id?: string;
};

export type UrbanOption = {
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
    file: UrbanFileFormat;
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
    file: UrbanFileFormat;
    name?: string;
    buttons?: UrbanButton[];
    duration?: number;
    author?: string;
};

export type UrbanMessageAudio = UrbanMessageCommon & {
    nodeName: 'urban-audio';
    data: UrbanMessageAudioData;
};

export type UrbanMessageVideoData = UrbanMessageCommonData & {
    title?: string;
    file: UrbanFileFormat;
    name?: string;
    buttons?: UrbanButton[];
    duration?: number;
    width?: number;
    height?: number;
    author?: string;
};

export type UrbanMessageVideo = UrbanMessageCommon & {
    nodeName: 'urban-video';
    data: UrbanMessageVideoData;
};

export type UrbanMessageFileData = UrbanMessageCommonData & {
    title?: string;
    file: UrbanFileFormat;
    buttons?: UrbanButton[];
};

export type UrbanMessageFile = UrbanMessageCommon & {
    nodeName: 'urban-file';
    data: UrbanMessageFileData;
};

export type UrbanMessagePollData = UrbanMessageCommonData & {
    question: string;
    options: UrbanOption[];
    isAnonymous?: boolean;
    type?: string;
    withMultipleAnswers?: boolean;
    rightOption?: string | number;
    explanation?: string;
    parseMode?: UrbanParseMode;
    activeSeconds?: number;
    closeTime?: number;
    buttons?: UrbanButton[];
};

export type UrbanMessagePoll = UrbanMessageCommon & {
    nodeName: 'urban-poll';
    data: UrbanMessagePollData;
};

export type UrbanMessageContactData = UrbanMessageCommonData & {
    phoneNumber?: string | number;
    firstName?: string;
    lastName?: string;
    vCard?: string;
    username?: string;
    buttons?: UrbanButton[];
};

export type UrbanMessageContact = UrbanMessageCommon & {
    nodeName: 'urban-contact';
    data: UrbanMessageContactData;
};

export type UrbanMessage =
    | UrbanMessageText
    | UrbanMessageImage
    | UrbanMessageButtons
    | UrbanMessageAudio
    | UrbanMessageVideo
    | UrbanMessageFile
    | UrbanMessagePoll
    | UrbanMessageContact;
export type UrbanMessageData =
    | UrbanMessageTextData
    | UrbanMessageImageData
    | UrbanMessageButtonsData
    | UrbanMessageAudioData
    | UrbanMessageVideoData
    | UrbanMessageFileData
    | UrbanMessagePollData
    | UrbanMessageContactData;

type Meta<MessageMeta> = {
    meta: MessageMeta;
};

export type UrbanExistingMessage<MessageMeta = unknown> = UrbanMessage & Meta<MessageMeta>;

export type UrbanExistingMessageByType<T extends UrbanMessageNodeName, MessageMeta = unknown> = T extends 'urban-text'
    ? UrbanMessageText & Meta<MessageMeta>
    : T extends 'urban-buttons'
    ? UrbanMessageButtons & Meta<MessageMeta>
    : T extends 'urban-img'
    ? UrbanMessageImage & Meta<MessageMeta>
    : T extends 'urban-audio'
    ? UrbanMessageAudio & Meta<MessageMeta>
    : T extends 'urban-video'
    ? UrbanMessageVideo & Meta<MessageMeta>
    : T extends 'urban-file'
    ? UrbanMessageFile & Meta<MessageMeta>
    : T extends 'urban-poll'
    ? UrbanMessagePoll & Meta<MessageMeta>
    : T extends 'urban-contact'
    ? UrbanMessageContact & Meta<MessageMeta>
    : UrbanExistingMessage<MessageMeta>;

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
