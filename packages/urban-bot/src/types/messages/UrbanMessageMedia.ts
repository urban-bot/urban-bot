import type { UrbanButton } from './UrbanMessageButtons';
import type { UrbanMessageImageData } from './UrbanMessageImage';
import type { UrbanMessageVideoData } from './UrbanMessageVideo';
import type { UrbanMessageAudioData } from './UrbanMessageAudio';
import type { UrbanMessageFileData } from './UrbanMessageFile';
import type { UrbanMessageCommon, UrbanMessageCommonData } from './UrbanMessageCommon';

export type UrbanMessageMediaData = UrbanMessageCommonData & {
    title?: string;
    files: Array<
        | (UrbanMessageImageData & { type: 'image' })
        | (UrbanMessageVideoData & { type: 'video' })
        | (UrbanMessageAudioData & { type: 'audio' })
        | (UrbanMessageFileData & { type: 'file' })
    >;
    buttons?: UrbanButton[] | UrbanButton[][];
};

export type UrbanMessageMedia = UrbanMessageCommon & {
    nodeName: 'urban-media';
    data: UrbanMessageMediaData;
};
