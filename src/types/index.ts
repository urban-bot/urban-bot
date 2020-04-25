export type UrbanChat = {
    id: string;
};

export type UrbanFrom = {
    id?: string;
    username?: string;
    firstName?: string;
    surname?: string;
};

export type UrbanFile = {
    id?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
};

export type UrbanParseMode = 'HTML' | 'markdown';

export type UrbanListener<Event> = (event: Event) => unknown;
