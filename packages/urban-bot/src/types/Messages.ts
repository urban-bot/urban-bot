import { UrbanChat, UrbanFileFormat, UrbanParseMode } from './index';
import { OtherProps } from './common';

export type UrbanButton = OtherProps & {
    text: string;
    id?: string;
    url?: string;
    phoneNumber?: string | number;
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
    personaId?: number | string;
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
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
    alt?: string;
};

export type UrbanMessageImage = UrbanMessageCommon & {
    nodeName: 'urban-img';
    data: UrbanMessageImageData;
};

export type UrbanMessageButtonsData = UrbanMessageCommonData & {
    title: string;
    buttons: UrbanButton[] | UrbanButton[][];
    isReplyButtons: boolean;
};

export type UrbanMessageButtons = UrbanMessageCommon & {
    nodeName: 'urban-buttons';
    data: UrbanMessageButtonsData;
};

export type UrbanMessageAudioData = UrbanMessageCommonData & {
    title?: string;
    file: UrbanFileFormat;
    name?: string;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
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
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
    duration?: number;
    width?: number;
    height?: number;
    author?: string;
};

export type UrbanMessageVideo = UrbanMessageCommon & {
    nodeName: 'urban-video';
    data: UrbanMessageVideoData;
};

export type UrbanMessageAnimationData = UrbanMessageCommonData & {
    title?: string;
    file: UrbanFileFormat;
    name?: string;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
    duration?: number;
    width?: number;
    height?: number;
};

export type UrbanMessageAnimation = UrbanMessageCommon & {
    nodeName: 'urban-animation';
    data: UrbanMessageAnimationData;
};

export type UrbanMessageFileData = UrbanMessageCommonData & {
    title?: string;
    file: UrbanFileFormat;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
    name?: string;
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
    livePeriod?: number;
    closeTime?: number;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
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
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
};

export type UrbanMessageContact = UrbanMessageCommon & {
    nodeName: 'urban-contact';
    data: UrbanMessageContactData;
};

export type UrbanMessageMediaData = UrbanMessageCommonData & {
    files: Array<(UrbanMessageImageData & { type: 'image' }) | (UrbanMessageVideoData & { type: 'video' })>;
};

export type UrbanMessageMedia = UrbanMessageCommon & {
    nodeName: 'urban-media';
    data: UrbanMessageMediaData;
};

export type UrbanMessageLocationData = UrbanMessageCommonData & {
    latitude: number;
    longitude: number;
    livePeriod?: number;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
    title?: string;
};

export type UrbanMessageLocation = UrbanMessageCommon & {
    nodeName: 'urban-location';
    data: UrbanMessageLocationData;
};

export type UrbanMessage =
    | UrbanMessageText
    | UrbanMessageImage
    | UrbanMessageButtons
    | UrbanMessageAudio
    | UrbanMessageVideo
    | UrbanMessageFile
    | UrbanMessagePoll
    | UrbanMessageAnimation
    | UrbanMessageContact
    | UrbanMessageLocation
    | UrbanMessageMedia;
export type UrbanMessageData =
    | UrbanMessageTextData
    | UrbanMessageImageData
    | UrbanMessageButtonsData
    | UrbanMessageAudioData
    | UrbanMessageVideoData
    | UrbanMessageAnimationData
    | UrbanMessageFileData
    | UrbanMessagePollData
    | UrbanMessageContactData
    | UrbanMessageLocationData
    | UrbanMessageMediaData;

type Meta<MessageMeta = any> = {
    meta: MessageMeta;
};

export type UrbanExistingMessage<MessageMeta = any> = UrbanMessage & Meta<MessageMeta>;

export type UrbanExistingMessageByType<T extends UrbanMessageNodeName, MessageMeta = any> = T extends 'urban-text'
    ? UrbanMessageText & Meta<MessageMeta>
    : T extends 'urban-buttons'
    ? UrbanMessageButtons & Meta<MessageMeta>
    : T extends 'urban-img'
    ? UrbanMessageImage & Meta<MessageMeta>
    : T extends 'urban-audio'
    ? UrbanMessageAudio & Meta<MessageMeta>
    : T extends 'urban-video'
    ? UrbanMessageVideo & Meta<MessageMeta>
    : T extends 'urban-animation'
    ? UrbanMessageAnimation & Meta<MessageMeta>
    : T extends 'urban-file'
    ? UrbanMessageFile & Meta<MessageMeta>
    : T extends 'urban-poll'
    ? UrbanMessagePoll & Meta<MessageMeta>
    : T extends 'urban-contact'
    ? UrbanMessageContact & Meta<MessageMeta>
    : T extends 'urban-media'
    ? UrbanMessageMedia & Meta<MessageMeta>
    : T extends 'urban-location'
    ? UrbanMessageLocation & Meta<MessageMeta>
    : UrbanExistingMessage<MessageMeta>;

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
