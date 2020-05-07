// TODO describe more
export type UrbanChat = {
    id: string;
};

export type UrbanFrom = {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
};

// TODO describe image,video,... separately and extends them from UrbanFile
export type UrbanFile = {
    id?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    duration?: number;
};

export type UrbanFileFormat = string | Buffer | NodeJS.ReadableStream;

export type UrbanParseMode = 'HTML' | 'markdown';

export type UrbanListener<Event> = (event: Event) => unknown;

export * from './common';
export * from './Events';
export * from './Messages';
export * from './UrbanBot';
