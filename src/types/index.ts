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
    size?: number;
    width?: number;
    height?: number;
};

export type UrbanParseMode = 'HTML' | 'markdown';

export type UrbanListener<Event> = (event: Event) => unknown;
