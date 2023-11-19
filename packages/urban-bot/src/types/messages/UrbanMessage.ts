import type { UrbanBotType } from '../bot';
import type { UrbanMessageAnimation, UrbanMessageAnimationData } from './UrbanMessageAnimation';
import type { UrbanMessageAudio, UrbanMessageAudioData } from './UrbanMessageAudio';
import type { UrbanMessageButtons, UrbanMessageButtonsData } from './UrbanMessageButtons';
import type { UrbanMessageContact, UrbanMessageContactData } from './UrbanMessageContact';
import type { UrbanMessageFile, UrbanMessageFileData } from './UrbanMessageFile';
import type { UrbanMessageImage, UrbanMessageImageData } from './UrbanMessageImage';
import type { UrbanMessageLocation, UrbanMessageLocationData } from './UrbanMessageLocation';
import type { UrbanMessageMedia, UrbanMessageMediaData } from './UrbanMessageMedia';
import type { UrbanMessagePoll, UrbanMessagePollData } from './UrbanMessagePoll';
import type { UrbanMessageText, UrbanMessageTextData } from './UrbanMessageText';
import type { UrbanMessageVideo, UrbanMessageVideoData } from './UrbanMessageVideo';

type Meta<BotType extends UrbanBotType> = {
    meta: BotType['MessageMeta'];
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

export type UrbanExistingMessage<BotType extends UrbanBotType> = UrbanMessage & Meta<BotType>;

export type UrbanExistingMessageByType<
    BotType extends UrbanBotType,
    T extends UrbanMessageNodeName
> = T extends 'urban-text'
    ? UrbanMessageText & Meta<BotType>
    : T extends 'urban-buttons'
    ? UrbanMessageButtons & Meta<BotType>
    : T extends 'urban-img'
    ? UrbanMessageImage & Meta<BotType>
    : T extends 'urban-audio'
    ? UrbanMessageAudio & Meta<BotType>
    : T extends 'urban-video'
    ? UrbanMessageVideo & Meta<BotType>
    : T extends 'urban-animation'
    ? UrbanMessageAnimation & Meta<BotType>
    : T extends 'urban-file'
    ? UrbanMessageFile & Meta<BotType>
    : T extends 'urban-poll'
    ? UrbanMessagePoll & Meta<BotType>
    : T extends 'urban-contact'
    ? UrbanMessageContact & Meta<BotType>
    : T extends 'urban-media'
    ? UrbanMessageMedia & Meta<BotType>
    : T extends 'urban-location'
    ? UrbanMessageLocation & Meta<BotType>
    : UrbanExistingMessage<BotType>;

export type UrbanMessageNodeName = UrbanMessage['nodeName'];
