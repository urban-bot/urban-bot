import { OtherProps } from '../common';

// TODO describe image,video,... separately and extends them from UrbanFile
export type UrbanFile = OtherProps & {
    id?: string;
    url?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    type?: string;
    duration?: number;
};
