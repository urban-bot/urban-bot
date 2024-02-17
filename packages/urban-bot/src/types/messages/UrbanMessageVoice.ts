import type { UrbanFileFormat } from '../bot';
import type { UrbanButton } from './UrbanMessageButtons';
import type { UrbanMessageCommon, UrbanMessageCommonData } from './UrbanMessageCommon';

export type UrbanMessageVoiceData = UrbanMessageCommonData & {
    file: UrbanFileFormat;
    title?: string;
    duration?: number;
    buttons?: UrbanButton[] | UrbanButton[][];
    isReplyButtons?: boolean;
};

export type UrbanMessageVoice = UrbanMessageCommon & {
    nodeName: 'urban-voice';
    data: UrbanMessageVoiceData;
};
