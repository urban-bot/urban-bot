import { UrbanBot, UrbanChat, UrbanFileFormat, UrbanParseMode } from './index';
import { OtherProps } from './common';
import { BotMetaByBot } from '../hooks/hooks';

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
    replyToMessageId?: string | number;
    forceReply?: boolean;
    personaId?: string | number;
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
    livePeriodSeconds?: number;
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
    livePeriodSeconds?: number;
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

type Meta<Bot extends UrbanBot> = {
    meta: BotMetaByBot<Bot>['MessageMeta'];
};

export type UrbanExistingMessage<Bot extends UrbanBot> = UrbanMessage & Meta<Bot>;

export type UrbanExistingMessageByType<Bot extends UrbanBot, T extends UrbanMessageNodeName> = T extends 'urban-text'
    ? UrbanMessageText & Meta<Bot>
    : T extends 'urban-buttons'
    ? UrbanMessageButtons & Meta<Bot>
    : T extends 'urban-img'
    ? UrbanMessageImage & Meta<Bot>
    : T extends 'urban-audio'
    ? UrbanMessageAudio & Meta<Bot>
    : T extends 'urban-video'
    ? UrbanMessageVideo & Meta<Bot>
    : T extends 'urban-animation'
    ? UrbanMessageAnimation & Meta<Bot>
    : T extends 'urban-file'
    ? UrbanMessageFile & Meta<Bot>
    : T extends 'urban-poll'
    ? UrbanMessagePoll & Meta<Bot>
    : T extends 'urban-contact'
    ? UrbanMessageContact & Meta<Bot>
    : T extends 'urban-media'
    ? UrbanMessageMedia & Meta<Bot>
    : T extends 'urban-location'
    ? UrbanMessageLocation & Meta<Bot>
    : UrbanExistingMessage<Bot>;

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
