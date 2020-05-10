export type UrbanChat = {
    id: string;
    type?: string;
    title?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    inviteLink?: string;
};

export type UrbanFrom = {
    id?: string;
    isBot?: boolean;
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

export type UrbanCommand = {
    command: string;
    description?: string;
};

export * from './common';
export * from './Events';
export * from './Messages';
export * from './UrbanBot';
